import React, { useState, useEffect, useRef } from 'react';
import { Layer, Stage, StageProps } from 'react-konva';
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

interface CanvasProps {
    initialMusicians?: Musician[];
}

interface ContextMenuState {
    visible: boolean;
    position: Position;
    currentItemId: number | null;
}

const Toolbar = styled.div`
    display: flex;
    align-items: center;
`;

const ZoomButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
`;

const LinesLabel = styled.label`
    display: inline-block;
    margin-left: 5px;
    vertical-align: middle;
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
    const [lines, setLines] = useState<Array<{id: number; startItemId: number; endItemId: number}>>([]);
    const [firstItemId, setFirstItemId] = useState<number | null>(null);
    const [showLines, setShowLines] = useState<boolean>(true);
    const [musicians, setMusicians] = useState<Musician[]>([
        { id: 2, name: 'Leti', instrument: 'F1' },
        { id: 3, name: 'Joanna', instrument: 'C' },
        { id: 4, name: 'Aitor', instrument: 'C' },
        { id: 5, name: 'Manu', instrument: 'C' },
        { id: 6, name: 'Leo', instrument: 'C' },
        { id: 7, name: 'Snez', instrument: 'C' },
        { id: 8, name: 'Pere', instrument: 'C' },
        { id: 9, name: 'Wally', instrument: 'C' },
        { id: 10, name: 'Adeline', instrument: 'D1' },
        { id: 11, name: 'Maria', instrument: 'D1' },
        { id: 12, name: 'Emiliana', instrument: 'D1' },
        { id: 13, name: 'Nicole', instrument: 'D1' },
        { id: 14, name: 'Maya', instrument: 'D1' },
        { id: 15, name: 'Elena', instrument: 'D2' },
        { id: 16, name: 'Sara', instrument: 'D2' },
        { id: 17, name: 'Lucia', instrument: 'D2' },
        { id: 18, name: 'Tania', instrument: 'F2' },
        { id: 19, name: 'Lara', instrument: 'F2' },
        { id: 20, name: 'Sab', instrument: 'M' },
        { id: 21, name: 'Moni', instrument: 'M' },
    ]);
    const [selectedMusicians, setSelectedMusicians] = useState<Musician[]>([]);
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

    const [draggedItemId, setDraggedItemId] = useState<number | null>(null);

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

    const handleContextMenu = (e: Konva.KonvaEventObject<MouseEvent>, itemId: number) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

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

    const handleExportCanvas = () => {
        if (!stageRef.current) return;

        const dataURL = stageRef.current.toDataURL();
        const link = document.createElement('a');
        link.download = 'canvas-export.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const addLineConnection = (endId: number) => {
        if (firstItemId === null) return;
        handleLineAdd(firstItemId, endId);
    };

    const handleLineAdd = (startId: number, endId: number) => {
        const newLine = {
            id: Date.now(),
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
        const itemsIds = items.map(item => item.id);

        const intersection = selectedMusicianIds.filter(id => itemsIds.includes(id));
        const complementary = [
            ...selectedMusicianIds.filter(id => !itemsIds.includes(id)),
            ...itemsIds.filter(id => !selectedMusicianIds.includes(id))
        ];

        const existingMusicians = items.filter(item => intersection.includes(item.id));
        const newMusicians = selectedMusicians.filter(m => complementary.includes(m.id));

        const existingMaster = items.find(m => m.id === firstItemId);
        const newItems = [
            existingMaster,
            ...existingMusicians,
            ...newMusicians
        ].filter(Boolean) as CanvasItemType[];

        setItems(newItems);

        newMusicians.forEach(musician => {
            addLineConnection(musician.id);
        });

        setDialogs(prev => ({ ...prev, addMusician: false }));
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

    return (
        <div>
            <Toolbar>
                <HamburgerMenu
                    onMenuItemClick={() => setDialogs(prev => ({ ...prev, addMusician: true }))}
                    onExportCanvas={handleExportCanvas}
                />
                <ZoomButton onClick={() => handleZoom(Math.min(scale * 1.1, 2.6))}>
                    <FaSearchPlus />
                </ZoomButton>
                <ZoomButton onClick={() => handleZoom(Math.max(scale * 0.9, 0.3))}>
                    <FaSearchMinus />
                </ZoomButton>
                <LinesLabel>
                    <input
                        type="checkbox"
                        checked={showLines}
                        onChange={() => setShowLines(!showLines)}
                    />
                    Mostrar líneas
                </LinesLabel>
            </Toolbar>

            <Stage
                width={window.innerWidth/0.3}
                height={window.innerHeight/0.3}
                ref={stageRef}
                draggable
            >
                <Background width={window.innerWidth/0.3} height={window.innerHeight/0.3} color="white" />
                <Layer>
                    {showLines && lines.map(line => (
                        <CanvasLine
                            key={line.id}
                            startItem={items.find(item => item.id === line.startItemId)}
                            endItem={items.find(item => item.id === line.endItemId)}
                        />
                    ))}
                    {items.map(item => (
                        <CanvasItem
                            key={item.id}
                            x={item.x || 100}
                            y={item.y || 100}
                            musician={item.musician}
                            imageUrl={findAvatarByName(item.musician.name.toLowerCase())}
                            onDragMove={(pos) => handleDragMove(item.id, pos)}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                            onDblClick={(e) => handleContextMenu(e, item.id)}
                        />
                    ))}
                </Layer>
            </Stage>

            {contextMenu.visible && (
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
            />

            <InstrumentDialog
                isOpen={dialogs.instrument}
                instruments={instruments}
                onClose={() => setDialogs(prev => ({ ...prev, instrument: false }))}
                onSelect={(instrument) => {
                    if (contextMenu.currentItemId) {
                        setItems(prev => prev.map(item =>
                            item.id === contextMenu.currentItemId
                                ? { ...item, musician: { ...item.musician, instrument }}
                                : item
                        ));
                    }
                    setDialogs(prev => ({ ...prev, instrument: false }));
                }}
            />
        </div>
    );
};
