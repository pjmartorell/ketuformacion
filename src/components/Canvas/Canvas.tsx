import React, { useState, useEffect, useRef } from 'react';
import { Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { CanvasItem as CanvasItemType, Musician, Position, Instrument, CanvasDesign } from '../../types/types';
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
import { canvasStorage } from '../../services/canvasStorage';
import { CanvasDesignsDialog } from '../Dialog/CanvasDesignsDialog';
import { useToast } from '../../context/ToastContext';
import { MASTER_MUSICIAN, isSpecialMusician } from '../../constants/musicians';
import { areCanvasStatesEqual } from '../../utils/compareUtils';
import { useHotkeys } from 'react-hotkeys-hook';
import { autosaveStorage } from '../../services/autosaveStorage';
import { HistoryManager, HistoryState } from '../../utils/historyManager';
import { ResetIcon, CommitIcon } from '@radix-ui/react-icons';

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
  padding: ${({ theme }) => theme.spacing.xs};
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.blue[200]};
  z-index: 1000;
`;

const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.blue[200]};
    margin-right: ${({ theme }) => theme.spacing.xs};
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

const UndoButton = styled(ZoomButton)<{ disabled?: boolean }>`
    opacity: ${props => props.disabled ? 0.5 : 1};
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
`;

const RedoButton = styled(UndoButton)``;

// Rename the icons for clarity
const UndoIcon = ResetIcon;
const RedoIcon = styled(ResetIcon)`
    transform: scaleX(-1);
`;

const ToggleButton = styled(ZoomButton)<{ active: boolean }>`
  background: ${({ active, theme }) =>
    active ? theme.gradients.primary : theme.colors.white[300]};
  color: ${({ active, theme }) =>
    active ? theme.colors.white[500] : theme.colors.blue[900]};

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.gradients.primary : theme.colors.blue[100]};
  }
`;

export const Canvas: React.FC<CanvasProps> = ({ initialMusicians = [] }) => {
    const master: CanvasItemType = {
        id: MASTER_MUSICIAN.id,
        x: 100,
        y: 100,
        musician: MASTER_MUSICIAN
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

    const [designs, setDesigns] = useState<CanvasDesign[]>([]);
    const [currentDesign, setCurrentDesign] = useState<CanvasDesign>();
    const [isDesignsDialogOpen, setIsDesignsDialogOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const { showToast } = useToast();
    const historyManager = useRef(new HistoryManager());
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Add this state to track if the change was from undo/redo
    const isHistoryAction = useRef(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        storageService.initializeIfNeeded();
        setMusicians(storageService.getMusicians());
    }, []);

    useEffect(() => {
        setDesigns(canvasStorage.getAll());
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
            const itemToDelete = items.find(item => item.id === contextMenu.currentItemId);
            if (itemToDelete && isSpecialMusician(itemToDelete.musician.id)) {
                showToast({
                    title: 'Acción no permitida',
                    description: 'El director no puede ser eliminado.',
                    type: 'error'
                });
                return;
            }
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
        setIsDragging(true);
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
        setIsDragging(false);
        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });

        // Record history after drag ends
        const currentState: HistoryState = { items, lines, scale };
        historyManager.current.push(currentState);
        setCanUndo(historyManager.current.canUndo());
        setCanRedo(historyManager.current.canRedo());
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
        // Prevent deletion of master musician
        if (isSpecialMusician(musicianId)) {
            showToast({
                title: 'Acción no permitida',
                description: 'El director no puede ser eliminado.',
                type: 'error'
            });
            return;
        }

        // Check if musician exists in any saved designs
        const affectedDesigns = designs.filter(design =>
            design.items.some(item => item.musician.id === musicianId)
        );

        if (affectedDesigns.length > 0) {
            showToast({
                title: 'Advertencia',
                description: `Este músico aparece en ${affectedDesigns.length} diseños guardados que serán actualizados.`,
                type: 'info'
            });
        }

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

        // Update affected designs
        affectedDesigns.forEach(design => {
            const updatedDesign = {
                ...design,
                items: design.items.filter(item => item.musician.id !== musicianId),
                lines: design.lines.filter(line => {
                    const startItem = design.items.find(i => i.id === line.startItemId);
                    const endItem = design.items.find(i => i.id === line.endItemId);
                    return !(startItem?.musician.id === musicianId || endItem?.musician.id === musicianId);
                })
            };
            canvasStorage.save(updatedDesign);
        });

        setDesigns(canvasStorage.getAll());
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
                avatarDataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(imageFile);
                });
            }
        }

        // Update musician data with proper type casting
        const updatedMusician: Musician = {
            ...(editDialog.musician || { id: Date.now() }),
            ...musicianData,
            avatar: avatarDataUrl || undefined
        } as Musician;

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

    useEffect(() => {
        if (currentDesign) {
            const currentState = { items, lines, scale };
            const savedState = {
                items: currentDesign.items,
                lines: currentDesign.lines,
                scale: currentDesign.scale
            };

            const hasChanges = !areCanvasStatesEqual(currentState, savedState);
            setHasUnsavedChanges(hasChanges);
        }
    }, [items, lines, scale, currentDesign]);

    const handleLoadDesign = (design: CanvasDesign) => {
        // Check for unsaved changes
        if (hasUnsavedChanges) {
            const confirmLoad = window.confirm(
                'Hay cambios sin guardar. ¿Deseas continuar y perder los cambios?'
            );
            if (!confirmLoad) return;
        }

        // Ensure master is present and valid
        const hasMaster = design.items.some(item => item.musician.id === MASTER_MUSICIAN.id);
        const validItems = design.items.filter(item =>
            item.musician.id === MASTER_MUSICIAN.id ||
            musicians.some(m => m.id === item.musician.id)
        );

        // If master is missing, add it
        if (!hasMaster) {
            validItems.unshift({
                ...master,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });
        }


        // If some musicians are missing, notify user
        if (validItems.length !== design.items.length) {
            showToast({
                title: 'Advertencia',
                description: 'Algunos músicos del diseño ya no existen y han sido omitidos.',
                type: 'info'
            });
        }

        // Validate and clean up lines
        const validLines = design.lines.filter(line =>
            validItems.some(item => item.id === line.startItemId) &&
            validItems.some(item => item.id === line.endItemId)
        );

        setItems(validItems);
        setLines(validLines);
        setScale(design.scale);

        // Adjust position based on current window size
        if (stageRef.current) {
            const stage = stageRef.current;
            // Use default window size if not present in design (backwards compatibility)
            const designWindowWidth = design.windowSize?.width || 1920; // Default width
            const scaleRatio = window.innerWidth / designWindowWidth;
            const adjustedPosition = {
                x: (design.position.x || 0) * scaleRatio,
                y: (design.position.y || 0) * scaleRatio
            };
            stage.position(adjustedPosition);
        }

        // Add missing properties if loading an old design
        const normalizedDesign: CanvasDesign = {
            ...design,
            items: validItems,
            lines: validLines,
            windowSize: design.windowSize || {
                width: 1920,
                height: 1080
            }
        };

        setCurrentDesign(normalizedDesign);
        setIsDesignsDialogOpen(false);
        historyManager.current.clear();
        const currentState: HistoryState = {
            items: validItems,
            lines: validLines,
            scale: design.scale
        };
        historyManager.current.push(currentState);
        setCanUndo(false);
        setCanRedo(false);
    };

    const handleSaveDesign = (name: string) => {
        const existingDesign = designs.find(d => d.name === name);

        if (existingDesign) {
            const confirmOverwrite = window.confirm(
                'Ya existe un diseño con este nombre. ¿Deseas sobrescribirlo?'
            );
            if (!confirmOverwrite) {
                throw new Error('Operación cancelada');
            }
            // If overwriting, use the existing design's ID
            saveDesign(name, existingId);
        } else {
            // If new name, create with new ID
            saveDesign(name);
        }
    };

    const saveDesign = (name: string, existingId?: string) => {
        // Don't save empty designs
        if (items.length <= 1) {
            showToast({
                title: 'Error',
                description: 'No se puede guardar un diseño vacío',
                type: 'error'
            });
            throw new Error('Diseño vacío');
        }

        const design: CanvasDesign = {
            id: existingId || crypto.randomUUID(), // Use existing ID or generate new one
            name,
            items,
            lines,
            scale,
            position: stageRef.current?.position() || { x: 0, y: 0 },
            windowSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            createdAt: existingId ? (designs.find(d => d.id === existingId)?.createdAt || Date.now()) : Date.now(),
            updatedAt: Date.now()
        };

        canvasStorage.save(design);
        setDesigns(canvasStorage.getAll());
        setCurrentDesign(design);
        setHasUnsavedChanges(false);
    };

    const handleDeleteDesign = (id: string) => {
        canvasStorage.delete(id);
        setDesigns(canvasStorage.getAll());
        if (currentDesign?.id === id) {
            setCurrentDesign(undefined);
        }
    };

    // Add window resize handler
    useEffect(() => {
        const handleResize = () => {
            if (currentDesign) {
                // Adjust stage position based on new window size
                const scaleRatio = window.innerWidth / currentDesign.windowSize.width;
                if (stageRef.current) {
                    const stage = stageRef.current;
                    const newPosition = {
                        x: currentDesign.position.x * scaleRatio,
                        y: currentDesign.position.y * scaleRatio
                    };
                    stage.position(newPosition);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [currentDesign]);

    // Check for autosave on mount
    useEffect(() => {
        const autosaved = autosaveStorage.load();
        if (autosaved) {
            const minutesAgo = (Date.now() - autosaved.timestamp) / (1000 * 60);
            if (minutesAgo < 30) { // Only restore if less than 30 minutes old
                const restore = window.confirm(
                    `Se encontró una sesión guardada automáticamente de hace ${Math.round(minutesAgo)} minutos. ¿Deseas restaurarla?`
                );
                if (restore) {
                    const { items, lines, scale } = autosaved.design;
                    setItems(items || [master]);
                    setLines(lines || []);
                    setScale(scale || 1);
                }
            }
            autosaveStorage.clear();
        }
    }, []);

    // Autosave every 30 seconds if there are changes
    useEffect(() => {
        const interval = setInterval(() => {
            if (hasUnsavedChanges) {
                autosaveStorage.save({ items, lines, scale });
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [items, lines, scale, hasUnsavedChanges]);

    // Modify the history effect to only track non-drag changes
    useEffect(() => {
        if (!isHistoryAction.current && !isDragging) {
            const currentState: HistoryState = { items, lines, scale };
            historyManager.current.push(currentState);
            setCanUndo(historyManager.current.canUndo());
            setCanRedo(historyManager.current.canRedo());
        }
        isHistoryAction.current = false;
    }, [items, lines, scale, isDragging]);

    const handleUndo = () => {
        const previousState = historyManager.current.undo();
        if (previousState) {
            isHistoryAction.current = true; // Prevent this change from being recorded
            setItems(previousState.items);
            setLines(previousState.lines);
            setScale(previousState.scale);
            setCanUndo(historyManager.current.canUndo());
            setCanRedo(historyManager.current.canRedo());
        }
    };

    const handleRedo = () => {
        const nextState = historyManager.current.redo();
        if (nextState) {
            isHistoryAction.current = true; // Prevent this change from being recorded
            setItems(nextState.items);
            setLines(nextState.lines);
            setScale(nextState.scale);
            setCanUndo(historyManager.current.canUndo());
            setCanRedo(historyManager.current.canRedo());
        }
    };

    // Initialize history with initial state
    useEffect(() => {
        const initialState: HistoryState = { items, lines, scale };
        historyManager.current.push(initialState);
        setCanUndo(false);
        setCanRedo(false);
    }, []); // Run only once on mount

    // Add keyboard shortcuts
    useHotkeys('ctrl+z, cmd+z', (e) => {
        e.preventDefault();
        handleUndo();
    }, [handleUndo]);

    useHotkeys('ctrl+shift+z, cmd+shift+z', (e) => {
        e.preventDefault();
        handleRedo();
    }, [handleRedo]);

    return (
        <div>
            <Toolbar>
                <ToolbarGroup>
                    <HamburgerMenu
                        onMenuItemClick={() => setDialogs(prev => ({ ...prev, addMusician: true }))}
                        onExportCanvas={handleExportCanvas}
                        onDesignsClick={() => setIsDesignsDialogOpen(true)}
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
                    <UndoButton disabled={!canUndo} onClick={handleUndo} title="Deshacer (Ctrl+Z)">
                        <UndoIcon />
                    </UndoButton>
                    <RedoButton disabled={!canRedo} onClick={handleRedo} title="Rehacer (Ctrl+Shift+Z)">
                        <RedoIcon />
                    </RedoButton>
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToggleButton
                        active={showLines}
                        onClick={() => setShowLines(!showLines)}
                        title="Mostrar/ocultar líneas"
                    >
                        <CommitIcon />
                    </ToggleButton>
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

            <CanvasDesignsDialog
                isOpen={isDesignsDialogOpen}
                onClose={() => setIsDesignsDialogOpen(false)}
                designs={designs}
                onLoad={handleLoadDesign}
                onSave={handleSaveDesign}
                onDelete={handleDeleteDesign}
                currentDesign={currentDesign}
            />
        </div>
    );
};
