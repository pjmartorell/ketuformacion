import React, { useState, useEffect, useRef } from 'react';
import {Layer, Stage} from 'react-konva';
import Konva from 'konva';
import CanvasItem from './CanvasItem';
import CanvasLine from './CanvasLine';
import Portal from "./Portal";
import ContextMenu from "./ContextMenu";
import "./Canvas.css";
import HamburgerMenu from './HamburgerMenu';
import InstrumentDialog from './InstrumentDialog';
import { findAvatarByName } from './utils/avatarUtils';

const Canvas = () => {
    const master = { id: 1, name: 'Alex', instrument: 'R', x: 100, y: 100 }
    const [items, setItems] = useState([master]);
    const [lines, setLines] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [firstItemId, setFirstItemId] = useState(master.id);

    const stageRef = useRef(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [currentShape, setCurrentShape] = useState(null);

    const [musicians, setMusicians] = useState([
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
    const [selectedMusicians, setSelectedMusicians] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const [instruments, setInstruments] = useState([
        { id: 1, name: 'R' },
        { id: 2, name: 'F1' },
        { id: 3, name: 'C' },
        { id: 4, name: 'D1' },
        { id: 5, name: 'D2' },
        { id: 6, name: 'F2' },
        { id: 7, name: 'M' },
    ]);
    const [selectedInstrument, setSelectedInstrument] = useState(null);
    const [showInstrumentDialog, setShowInstrumentDialog] = useState(false);

    const [showLines, setShowLines] = useState(true); // State to control line visibility

    const handleAddCanvasItemClick = () => {
        setShowAddDialog(true);
    };

    const handleAddMusiciansToCanvas = (selectedMusicians) => {
        console.log('Handle selected musicians: ', selectedMusicians);

        // This can probably be simplified, but it works for now
        const selectedMusicianIds = selectedMusicians.map((musician) => musician.id);
        const itemsIds = items.map((item) => item.id);
        const intersection = selectedMusicianIds.filter(value => itemsIds.includes(value));
        const complementary = [...selectedMusicianIds.filter(value => !itemsIds.includes(value)), ...itemsIds.filter(value => !selectedMusicianIds.includes(value))];
        const existingMusicians = items.filter((item) => intersection.includes(item.id));
        const newMusicians = selectedMusicians.filter((item) => complementary.includes(item.id));
        const existingMaster = items.find((musician) => musician.id === master.id);

        // Concatenate existing master, intersection and complementary arrays
        const newItems = [existingMaster,...existingMusicians, ...newMusicians];

        setItems(newItems);

        // Add line connections for each new musician added to the canvas only
        newMusicians.forEach((musician) => {
            addLineConnection(musician.id);
        });

        // Close the dialog
        setShowAddDialog(false);
    };

    const AddCanvasItemDialog = ({ musicians, onCancel, onConfirm }) => {
        const [selectedMusicians, setSelectedMusicians] = useState([]);

        const handleToggleMusician = (musician) => {
            if (selectedMusicians.includes(musician)) {
                setSelectedMusicians((prevSelected) =>
                    prevSelected.filter((item) => item.id !== musician.id)
                );
            } else {
                setSelectedMusicians((prevSelected) => [...prevSelected, musician]);
            }
        };

        const handleSelectAll = () => {
            setSelectedMusicians(musicians);
        };

        const handleConfirm = () => {
            console.log('Selected musicians: ', selectedMusicians);
            onConfirm(selectedMusicians);
        };

        return (
            <div className="select-musicians-dialog-overlay">
                <div className="select-musicians-dialog">
                    <h2>Percusionistas</h2>
                    <button onClick={handleSelectAll}>Seleccionar todos</button>
                    <div className="select-musicians-dialog-content">
                        {musicians.map((musician) => (
                            <div key={musician.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedMusicians.includes(musician)}
                                        onChange={() => handleToggleMusician(musician)}
                                    />
                                    {musician.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleConfirm}>Confirmar</button>
                    <button id={'close-select-dialog'} onClick={onCancel}>Cancelar</button>
                </div>
            </div>
        );
    };

    const handleOptionSelected = (e, option) => {
        if (option === 'delete_player') {
            console.log('Deleting player with ID: ', currentShape);
            const updatedItems = items.filter((item) => item.id !== currentShape);
            setItems(updatedItems);

            const updatedLines = lines.filter(
                (line) => line.startItemId !== currentShape && line.endItemId !== currentShape
            );
            setLines(updatedLines);

            // Remove the musician from selectedMusicians
            const updatedSelectedMusicians = selectedMusicians.filter(
                (musician) => musician.id !== currentShape
            );
            setSelectedMusicians(updatedSelectedMusicians);
        }
        else if (option === 'change_instrument') {
            console.log('Changing instrument...');
            setSelectedInstrument(null); // Clear previous selection
            setContextMenuVisible(false);
            setShowInstrumentDialog(true); // Show the instrument selection dialog
        }
        else {
            console.log('Option selected: ', option);
        }
        setContextMenuVisible(false);
    };

    const handleContextMenu = (e, itemId) => {
        e.evt.preventDefault();
        const mousePosition = e.target.getStage().getPointerPosition();

        setCurrentShape(itemId);
        setContextMenuPosition({ x: mousePosition.x, y: mousePosition.y });
        setContextMenuVisible(true);
    };

    const handleDragStart = (e) => {
        console.log('Dragging started...')

        e.target.setAttrs({
            shadowOffset: {
                x: 15,
                y: 15
            },
            scaleX: 1.1,
            scaleY: 1.1
        });
    };

    const handleDragEnd = (e) => {
        console.log('Dragging ended...')

        e.target.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: 1,
            scaleY: 1,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });
    };



    const addCanvasItem = (newItem) => {
        console.log('Adding canvas item with ID: ', newItem.id);

        setItems((prevItems) => [...prevItems, newItem]);
        addLineConnection(newItem.id);
    };

    const handleLineAdd = (startId, endId) => {
        const newLine = {
            id: Date.now(),
            startItemId: startId,
            endItemId: endId,
        };
        setLines((prevLines) => [...prevLines, newLine]);
        console.log('Line added between: ', startId, endId);
    };

    // Use useEffect to log the updated lines and items array
    // useEffect(() => {
    //     console.log('Lines after state update: ', lines);
    //     console.log('Items after state update: ', items);
    // }, [lines, items]);

    const addLineConnection = (endId) => {
        console.log('Adding a line connection...')
        if (firstItemId === null) {
            console.log('First item ID is null')
            return;
        }
        else {
            console.log('First item ID: ', firstItemId)
            handleLineAdd(firstItemId, endId);
        }
    };

    const handleDragMove = (itemId, x, y) => {
        const updatedItems = items.map((item) =>
            item.id === itemId ? { ...item, x, y } : item
        );
        setItems(updatedItems);
        updateLines(updatedItems);
    };

    const handleStageClick = (e) => {
        if (!draggedItemId) {
            return;
        }

        const newItem = {
            id: Date.now(),
            x: e.evt.layerX,
            y: e.evt.layerY,
        };

        setItems([...items, newItem]);
        setDraggedItemId(null);
    };

    const updateLines = (updatedItems) => {
        const updatedLines = lines.map((line) => {
            const startPoint = updatedItems.find((item) => item.id === line.startItemId);
            const endPoint = updatedItems.find((item) => item.id === line.endItemId);

            // Check if startPoint and endPoint are defined before accessing their properties
            const startCoords = startPoint ? [startPoint.x, startPoint.y] : [0, 0];
            const endCoords = endPoint ? [endPoint.x, endPoint.y] : [0, 0];

            // console.log('Start point: ', startCoords)
            // console.log('End point: ', endCoords)

            return { ...line, points: [...startCoords, ...endCoords] };
        });

        setLines(updatedLines);
    };

    const handleMenuItemClick = (menuItem) => {
        console.log('Menu item clicked: ', menuItem);
        if (menuItem === 'percusionistas') {
            setShowAddDialog(true);
        }
        // Handle other menu items here
    };

    const handleInstrumentDialogClose = () => {
        setShowInstrumentDialog(false);
    };

    const handleInstrumentSelect = (selected) => {
        setSelectedInstrument(selected);
        if (selected) {
            const updatedItems = items.map((item) => {
                if (item.id === currentShape) {
                    console.log('Updated musician: ', { ...item, instrument: selected })
                    return { ...item, instrument: selected };
                }
                return item;
            });
            setItems(updatedItems);
        }
        setShowInstrumentDialog(false);
    };

    const downloadDataURL = (dataURL, filename) => {
        const anchor = document.createElement('a');
        anchor.href = dataURL;
        anchor.download = filename;
        anchor.click();
    };
    const handleExportCanvas = () => {
        const stage = stageRef.current;
        const dataURL = stage.toDataURL({ pixelRatio: 3 });
        downloadDataURL(dataURL, 'canvas.png');
    };

    // Hides the ContextMenu when clicking outside of it
    useEffect(() => {
        const handleStageClick = () => {
            if (contextMenuVisible) {
                setContextMenuVisible(false);
            }
        };

        // Check if the ref is available before adding/removing event listener
        if (stageRef.current) {
            stageRef.current.addEventListener("click", handleStageClick);
        }

        // Clean up event listener when component unmounts
        return () => {
            if (stageRef.current) {
                stageRef.current.removeEventListener("click", handleStageClick);
            }
        };
    }, [contextMenuVisible]);

    const handleToggleLines = () => {
        setShowLines(!showLines);
    };

    return (
        <div>
            <HamburgerMenu onMenuItemClick={handleMenuItemClick} onExportCanvas={handleExportCanvas} />
            <label>
                <input
                    type="checkbox"
                    checked={showLines}
                    onChange={handleToggleLines}
                />
                Mostrar líneas
            </label>
            {showAddDialog && (
                <AddCanvasItemDialog
                    musicians={musicians} // Pass your list of musicians here
                    onCancel={() => setShowAddDialog(false)}
                    onConfirm={handleAddMusiciansToCanvas}
                />
            )}
            {showInstrumentDialog && (
                <InstrumentDialog
                    instruments={instruments}
                    onClose={handleInstrumentDialogClose}
                    onSelect={handleInstrumentSelect}
                />
            )}
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick} ref={stageRef}>
                <Layer>
                    {/* Render CanvasLines... */}
                    {showLines && lines.map((line) => (
                        <CanvasLine
                            key={line.id}
                            startItem={items.find((item) => item.id === line.startItemId)}
                            endItem={items.find((item) => item.id === line.endItemId)}
                        />
                    ))}

                    {/* Render selected musicians' CanvasItems */}
                    {/* If the musician has no x or y, we set it to 100 so the item is drawn to the default position */}
                    {items.map((item) => (
                        <CanvasItem
                            key={item.id}
                            x={item.x || 100}
                            y={item.y || 100}
                            musician_name={item.name}
                            musician_instrument={item.instrument}
                            imageUrl={findAvatarByName(item.name.toLowerCase())}
                            onDragMove={(e) => handleDragMove(item.id, e.target.x(), e.target.y())}
                            onDragStart={(e) => handleDragStart(e)}
                            onDragEnd={(e) => handleDragEnd(e)}
                            onDblClick={(e) => handleContextMenu(e, item.id)}
                            onDblTap={(e) => handleContextMenu(e, item.id)}
                        />
                    ))}
                </Layer>
                {contextMenuVisible && (
                    <Portal>
                        <ContextMenu
                            position={contextMenuPosition}
                            onOptionSelected={handleOptionSelected}
                            deleteDisabled={currentShape === firstItemId}
                        />
                    </Portal>
                )}
            </Stage>
        </div>
    );
};

export default Canvas;
