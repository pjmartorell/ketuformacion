import React, { useState, useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { CanvasItem as CanvasItemType, Musician, Position, Instrument } from '../../types/types';
import { CanvasItem } from './CanvasItem';
import { CanvasLine } from './CanvasLine';
import { Background } from './Background';
import { Portal } from '../Portal/Portal';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import { HamburgerMenu } from '../Menu/HamburgerMenu';
import { InstrumentDialog } from '../Dialog/InstrumentDialog';
import { findAvatarByName } from '../../utils/avatarUtils';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { KonvaEventObject } from 'konva/lib/Node';
import styled from 'styled-components';
import { MusicianDialog } from '../Dialog/MusicianDialog';
import { storageService } from '../../services/storage';
import { resizeImage } from '../../utils/imageUtils';

interface CanvasProps {
    initialMusicians?: Musician[];
}

interface ContextMenuState {
    visible: boolean;
    position: Position;
    currentItemId: number | null;
}

const Toolbar = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  z-index: 1000; // Lower than dialog
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};

  &:not(:last-child) {
    border-right: 2px solid ${({ theme }) => theme.colors.blue[200]};
    padding-right: ${({ theme }) => theme.spacing.sm};
  }
`;

const ZoomButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  color: ${({ theme }) => theme.colors.white[500]};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const LinesToggle = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.colors.blue[900]};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.xs}; // Added padding to match other groups

  input {
    appearance: none;
    width: 40px;
    height: 20px;
    background: ${({ theme }) => theme.colors.white[300]};
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: inset 0 1px 2px ${({ theme }) => theme.colors.blackA5};

    &:checked {
      background: ${({ theme }) => theme.colors.blue[500]};
    }

    &:before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      background: white;
      transition: transform 0.2s ease;
      box-shadow: ${({ theme }) => theme.shadows.sm};
    }

    &:checked:before {
      transform: translateX(20px);
    }
  }
`;

export const Canvas: React.FC<CanvasProps> = ({ initialMusicians = [] }) => {
    const master: CanvasItemType = {
        id: 1,
        x: 100,
        y: 100,
        musician: { id: 1, name: 'Alex', instrument: 'R' }
    };
    const stageRef = useRef<Konva.Stage>(null);
    const [scale, setScale] = useState<number>(1);
    const [items, setItems] = useState<CanvasItemType[]>([master]);
    const [lines, setLines] = useState<Array<{id: string; startItemId: number; endItemId: number}>>([]);
    const [firstItemId, setFirstItemId] = useState<number | null>(null);
    const [showLines, setShowLines] = useState<boolean>(true);
    const [musicians, setMusicians] = useState<Musician[]>([]);
    const [instruments] = useState<Instrument[]>([
        { id: 1, name: 'R' },
        { id: 2, name: 'F1' },
        { id: 3, name: 'C' },
        { id: 4, name: 'D1' },
        { id: 5, name: 'D2' },
        { id: 6, name: 'F2' },
        { id: 7, name: 'M' },
    ]);

    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        visible: false,
        position: { x: 0, y: 0 },
        currentItemId: null
    });

    const [dialogs, setDialogs] = useState({
        addMusician: false,
        instrument: false
    });

    const [editDialog, setEditDialog] = useState<{ isOpen: boolean; musician?: Musician }>({
        isOpen: false,
        musician: undefined,
    });

    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        storageService.initializeIfNeeded();
        setMusicians(storageService.getMusicians());
    }, []);

    const handleZoom = (newScale: number) => {
        if (stageRef.current) {
            const stage = stageRef.current;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            setScale(newScale);
            stage.scale({ x: newScale, y: newScale });
            stage.position(newPos);
            stage.batchDraw();
        }
    };

    const handleDragMove = (id: number, newPos: Position) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, x: newPos.x, y: newPos.y } : item
            )
        );
    };

    const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>, itemId: number) => {
        e.evt.preventDefault();
        e.cancelBubble = true;

        const stage = e.target.getStage();
        if (!stage) return;

        let pos;
        if ('touches' in e.evt) {
            const touch = e.evt.touches[0];
            pos = {
                x: touch.clientX,
                y: touch.clientY
            };
        } else {
            pos = stage.getPointerPosition();
        }

        if (!pos) return;

        // Use a single setState call to prevent race conditions
        setContextMenu({
            visible: true,
            position: pos,
            currentItemId: itemId
        });
    };

    const handleOptionSelected = (e: React.MouseEvent, option: string) => {
        if (!contextMenu.currentItemId) return;

        if (option === 'delete_player') {
            setItems(prev => prev.filter(item => item.id !== contextMenu.currentItemId));
            setLines(prev => prev.filter(line =>
                line.startItemId !== contextMenu.currentItemId &&
                line.endItemId !== contextMenu.currentItemId
            ));
        } else if (option === 'change_instrument') {
            setDialogs(prev => ({ ...prev, instrument: true }));
        }

        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const calculateBoundingBox = (items: CanvasItemType[]) => {
        if (items.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

        // Avatar size in pixels (assuming square avatars)
        const AVATAR_SIZE = 80;
        const PADDING = 30; // Increased padding for safety

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        items.forEach(item => {
            // Consider the full width and height of avatars
            minX = Math.min(minX, item.x - AVATAR_SIZE/2);
            minY = Math.min(minY, item.y - AVATAR_SIZE/2);
            maxX = Math.max(maxX, item.x + AVATAR_SIZE/2);
            maxY = Math.max(maxY, item.y + AVATAR_SIZE/2);
        });

        return {
            x: minX - PADDING,
            y: minY - PADDING,
            width: (maxX - minX) + (PADDING * 2),
            height: (maxY - minY) + (PADDING * 2)
        };
    };

    const handleExportCanvas = () => {
        if (!stageRef.current) return;

        setIsExporting(true); // Set exporting state to true before creating image

        // Small delay to ensure the UI updates before taking the screenshot
        setTimeout(() => {
            const stage = stageRef.current;
            const boundingBox = calculateBoundingBox(items);

            // Create temporary container
            const tempContainer = document.createElement('div');
            tempContainer.style.display = 'none';
            document.body.appendChild(tempContainer);

            // Create a temporary stage and layer for export
            const tempStage = new Konva.Stage({
                container: tempContainer,
                width: boundingBox.width,
                height: boundingBox.height,
            });

            const tempLayer = new Konva.Layer();
            tempStage.add(tempLayer);

            // Add white background
            const background = new Konva.Rect({
                x: 0,
                y: 0,
                width: boundingBox.width,
                height: boundingBox.height,
                fill: 'white',
            });
            tempLayer.add(background);

            // Clone all nodes and adjust their positions
            stage?.find('Layer').forEach(layer => {
                (layer as Konva.Layer).getChildren().forEach(child => {
                    if ((child as Konva.Shape).name() !== 'background') { // Skip original background
                        const clone = child.clone();
                        clone.x(clone.x() - boundingBox.x);
                        clone.y(clone.y() - boundingBox.y);
                        tempLayer.add(clone);
                    }
                });
            });

            // Create the data URL from the temporary stage
            const dataURL = tempStage.toDataURL({
                pixelRatio: 2,
                mimeType: 'image/png',
                quality: 1
            });

            // Clean up
            tempStage.destroy();
            document.body.removeChild(tempContainer);

            // Download image
            const link = document.createElement('a');
            link.download = 'canvas-export.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsExporting(false); // Reset exporting state
        }, 100);
    };

    const addLineConnection = (endId: number) => {
        if (firstItemId === null) return;
        handleLineAdd(firstItemId, endId);
    };

    const handleLineAdd = (startId: number, endId: number) => {
        const newLine = {
            id: `line_${startId}_${endId}_${Date.now()}`, // Make sure line IDs are unique
            startItemId: startId,
            endItemId: endId,
        };
        setLines(prev => [...prev, newLine]);
    };

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.target.setAttrs({
            shadowOffset: {
                x: 15,
                y: 15
            },
            scaleX: 1.1,
            scaleY: 1.1
        });
    };

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });
    };

    const handleAddMusiciansToCanvas = (selectedMusicians: Musician[]) => {
        const selectedMusicianIds = selectedMusicians.map(m => m.id);
        const itemsIds = items.map(item => item.musician.id);

        // Keep existing items that are still selected
        const existingItems = items.filter(item => selectedMusicianIds.includes(item.musician.id));

        // Only create new items for newly selected musicians
        const newMusicians = selectedMusicians
            .filter(m => !itemsIds.includes(m.id))
            .map(musician => ({
                id: musician.id,
                x: Math.random() * 400 + 100, // Random position between 100 and 500
                y: Math.random() * 400 + 100, // Random position between 100 and 500
                musician: musician
            }));

        const existingMaster = items.find(m => m.id === firstItemId);
        const newItems = [
            existingMaster,
            ...existingItems.filter(item => item.id !== firstItemId), // Exclude master from existing items
            ...newMusicians
        ].filter(Boolean) as CanvasItemType[];

        setItems(newItems);

        // Only add lines for new musicians
        newMusicians.forEach(item => {
            addLineConnection(item.id);
        });

        setDialogs(prev => ({ ...prev, addMusician: false }));
    };

    const getCurrentMusiciansInCanvas = () => {
        return items.map(item => item.musician);
    };

    const handleMusicianDeleted = (musicianId: number) => {
        // Get musician before removing it
        const musicianToDelete = musicians.find(m => m.id === musicianId);
        if (musicianToDelete) {
            // Delete avatar from storage
            storageService.deleteAvatar(musicianToDelete.name);
        }

        // Remove from musicians list
        setMusicians(prev => prev.filter(m => m.id !== musicianId));

        // Remove from canvas if present
        setItems(prev => prev.filter(item => item.musician.id !== musicianId));

        // Remove associated lines
        setLines(prev => prev.filter(line => {
            const startItem = items.find(i => i.id === line.startItemId);
            const endItem = items.find(i => i.id === line.endItemId);
            return !(startItem?.musician.id === musicianId || endItem?.musician.id === musicianId);
        }));
    };

    useEffect(() => {
        const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
            e.evt.preventDefault();
            if (!stageRef.current) return;

            const scaleBy = e.evt.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.max(0.3, Math.min(2.6, scale * scaleBy));
            handleZoom(newScale);
        };

        const stage = stageRef.current?.getStage();
        stage?.on('wheel', handleWheel);

        return () => {
            stage?.off('wheel', handleWheel);
        };
    }, [scale]);

    useEffect(() => {
        // Set firstItemId to master's id when component mounts
        setFirstItemId(master.id);
    }, []);

    // Add this useEffect for handling clicks outside context menu
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (contextMenu.visible) {
                setContextMenu(prev => ({ ...prev, visible: false }));
            }
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [contextMenu.visible]);

    // Cleanup context menu on unmount
    useEffect(() => {
        return () => {
            setContextMenu({
                visible: false,
                position: { x: 0, y: 0 },
                currentItemId: null
            });
        };
    }, []);

    const handleSave = async (musicianData: Partial<Musician>, imageFile?: File) => {
        let avatarDataUrl: string | undefined;

        // Handle image file if provided
        if (imageFile) {
            try {
                // Resize image before saving
                avatarDataUrl = await resizeImage(imageFile, 200, 200, 0.8);
            } catch (error) {
                console.error('Error resizing image:', error);
                // Fallback to original file if resize fails
                avatarDataUrl = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }
        }

        // Update musician data
        const updatedMusician = {
            ...(editDialog.musician || { id: Date.now() }),
            ...musicianData,
            avatar: avatarDataUrl // Add avatar to musician data
        };

        // Save avatar to storage if we have one
        if (avatarDataUrl) {
            storageService.saveAvatar(updatedMusician.name, avatarDataUrl);
        }

        const updatedMusicians = editDialog.musician
            ? musicians.map(m => m.id === editDialog.musician?.id ? updatedMusician : m)
            : [...musicians, updatedMusician];

        // Update storage and state
        storageService.saveMusicians(updatedMusicians);
        setMusicians(updatedMusicians);

        // Update canvas items if musician was modified
        if (editDialog.musician) {
            setItems(prev => prev.map(item =>
                item.musician.id === editDialog.musician?.id
                    ? { ...item, musician: updatedMusician }
                    : item
            ));
        }

        setEditDialog({ isOpen: false, musician: undefined });
    };

    const handleInstrumentChange = (instrument: string) => {
        if (!contextMenu.currentItemId) return;

        const updatedItem = items.find(item => item.id === contextMenu.currentItemId);
        if (!updatedItem) return;

        // Update musician in both items and musicians list
        const updatedMusician = { ...updatedItem.musician, instrument };

        setItems(prev => prev.map(item =>
            item.id === contextMenu.currentItemId
                ? { ...item, musician: updatedMusician }
                : item
        ));

        // Update musicians list and storage
        const updatedMusicians = musicians.map(m =>
            m.id === updatedMusician.id ? updatedMusician : m
        );
        setMusicians(updatedMusicians);
        storageService.saveMusicians(updatedMusicians);

        setDialogs(prev => ({ ...prev, instrument: false }));
    };

    return (
        <div>
            <Toolbar>
                <ToolbarGroup>
                    <HamburgerMenu
                        onMenuItemClick={() => setDialogs(prev => ({ ...prev, addMusician: true }))}
                        onExportCanvas={handleExportCanvas}
                    />
                </ToolbarGroup>

                <ToolbarGroup>
                    <ZoomButton onClick={() => handleZoom(Math.min(scale * 1.1, 2.6))} title="Zoom in">
                        <FaSearchPlus size={16} />
                    </ZoomButton>
                    <ZoomButton onClick={() => handleZoom(Math.max(scale * 0.9, 0.3))} title="Zoom out">
                        <FaSearchMinus size={16} />
                    </ZoomButton>
                </ToolbarGroup>

                <ToolbarGroup>
                    <LinesToggle>
                        <input
                            type="checkbox"
                            checked={showLines}
                            onChange={() => setShowLines(!showLines)}
                        />
                        <span>Mostrar líneas</span>
                    </LinesToggle>
                </ToolbarGroup>
            </Toolbar>

            <Stage
                width={window.innerWidth/0.3}
                height={window.innerHeight/0.3}
                ref={stageRef}
                draggable
            >
                <Layer>
                    <Background
                        width={window.innerWidth/0.3}
                        height={window.innerHeight/0.3}
                        color="white"
                        name="background"
                    />
                    {showLines && lines.map(line => (
                        <CanvasLine
                            key={`line-${line.id}`}
                            startItem={items.find(item => item.id === line.startItemId)}
                            endItem={items.find(item => item.id === line.endItemId)}
                        />
                    ))}
                    {items.map(item => (
                        <CanvasItem
                            key={`item-${item.id}`} // Change the key to only use item.id
                            forceHover={isExporting}
                            x={item.x || 100}
                            y={item.y || 100}
                            musician={item.musician}
                            imageUrl={findAvatarByName(item.musician.name.toLowerCase())}
                            onDragMove={(pos) => handleDragMove(item.id, pos)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onContextMenu={(e) => handleContextMenu(e, item.id)} // Changed from onDblClick to onContextMenu
                        />
                    ))}
                </Layer>
            </Stage>

            {contextMenu.visible && contextMenu.currentItemId && (
                <Portal>
                    <ContextMenu
                        position={contextMenu.position}
                        onOptionSelected={handleOptionSelected}
                        deleteDisabled={contextMenu.currentItemId === firstItemId}
                    />
                </Portal>
            )}

            <MusicianDialog
                isOpen={dialogs.addMusician}
                onClose={() => setDialogs(prev => ({ ...prev, addMusician: false }))}
                musicians={musicians}
                onSelect={handleAddMusiciansToCanvas}
                currentMusicians={getCurrentMusiciansInCanvas()} // Add this prop
                onMusicianDeleted={handleMusicianDeleted}
                instruments={instruments.map(i => i.name)}
                onEdit={(musician) => setEditDialog({ isOpen: true, musician })}
                editDialog={editDialog}
                onEditDialogClose={() => setEditDialog({ isOpen: false, musician: undefined })}
                onSave={handleSave}
            />

            <InstrumentDialog
                isOpen={dialogs.instrument}
                instruments={instruments}
                onClose={() => setDialogs(prev => ({ ...prev, instrument: false }))}
                onSelect={handleInstrumentChange}
            />
        </div>
    );
};
