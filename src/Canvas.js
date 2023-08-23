import React, { useEffect, useState, useRef } from 'react';
import {Group, Layer, Stage, Text} from 'react-konva';
import Konva from 'konva';
import CanvasItem from './CanvasItem';
import CanvasLine from './CanvasLine';
import logo from './logo.svg';
import Portal from "./Portal";
import ContextMenu from "./ContextMenu";
import "./Canvas.css";

const Canvas = () => {
    const [items, setItems] = useState([]);
    const [lines, setLines] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [firstItemId, setFirstItemId] = useState(null);
    const [avatarImage] = useState(logo);

    const stageRef = useRef(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [currentShape, setCurrentShape] = useState(null);

    const master = { id: 1, name: 'Alex', avatar: avatarImage, instrument: 'R', x: 100, y: 100 }
    const [musicians, setMusicians] = useState([
        { id: 2, name: 'Leti', avatar: avatarImage, instrument: 'F1' },
        { id: 3, name: 'Joanna', avatar: avatarImage, instrument: 'C' },
        { id: 4, name: 'Aitor', avatar: avatarImage, instrument: 'C' },
        { id: 5, name: 'Manu', avatar: avatarImage, instrument: 'C' },
        { id: 6, name: 'Leo', avatar: avatarImage, instrument: 'C' },
        { id: 7, name: 'Snez', avatar: avatarImage, instrument: 'C' },
        { id: 8, name: 'Pere', avatar: avatarImage, instrument: 'C' },
        { id: 9, name: 'Wally', avatar: avatarImage, instrument: 'C' },
        { id: 10, name: 'Adeline', avatar: avatarImage, instrument: 'D1' },
        { id: 11, name: 'Maria', avatar: avatarImage, instrument: 'D1' },
        { id: 12, name: 'Emiliana', avatar: avatarImage, instrument: 'D1' },
        { id: 13, name: 'Nicole', avatar: avatarImage, instrument: 'D1' },
        { id: 14, name: 'Maya', avatar: avatarImage, instrument: 'D1' },
        { id: 15, name: 'Elena', avatar: avatarImage, instrument: 'D2' },
        { id: 16, name: 'Sara', avatar: avatarImage, instrument: 'D2' },
        { id: 17, name: 'Lucia', avatar: avatarImage, instrument: 'D2' },
        { id: 18, name: 'Tania', avatar: avatarImage, instrument: 'F2' },
        { id: 19, name: 'Lara', avatar: avatarImage, instrument: 'F2' },
        { id: 20, name: 'Sab', avatar: avatarImage, instrument: 'M' },
        { id: 21, name: 'Moni', avatar: avatarImage, instrument: 'M' },
    ]);
    const [selectedMusicians, setSelectedMusicians] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);

    // This effect will run only once after the component is mounted
    const initializeComponent = () => {
        console.log('CanvasItem initialized...');
        addCanvasItem(master);
        setFirstItemId(master.id);
    };

    // Call the custom initialization function once when the component mounts
    useEffect(() => {
        initializeComponent();
    }, []); // Empty dependency array ensures the effect runs only once

    const handleAddCanvasItemClick = () => {
        setShowAddDialog(true);
    };

    const handleAddMusiciansToCanvas = (selectedMusicians) => {
        console.log('Handle selected musicians: ', selectedMusicians);

        // Add the selected musicians to the canvas
        // const newItems = selectedMusicians.map((musician) => ({
        //     id: musician.id,
        //     x: 100,
        //     y: 100,
        // }));

        // setItems((prevItems) => [...prevItems, ...newItems]);
        setItems([master, ...selectedMusicians]);

        // Add line connections for each selected musician
        selectedMusicians.forEach((musician) => {
            addLineConnection(musician.id);
        });
        // newItems.forEach((musician) => {
        //     addCanvasItem(musician);
        // });

        // Close the dialog
        setShowAddDialog(false);
    };

    // AddCanvasItemDialog.js
    const AddCanvasItemDialog = ({ musicians, onCancel, onConfirm }) => {
        const handleToggleMusician = (musician) => {
            if (selectedMusicians.includes(musician)) {
                setSelectedMusicians((prevSelected) =>
                    prevSelected.filter((item) => item.id !== musician.id)
                );
            } else {
                setSelectedMusicians((prevSelected) => [...prevSelected, musician]);
            }
        };

        const handleConfirm = () => {
            console.log('Selected musicians: ', selectedMusicians);
            onConfirm(selectedMusicians);
        };

        return (
            <div className="select-musicians-dialog-overlay">
                <div className="select-musicians-dialog">
                    <h2>Percusionistas</h2>
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
                    <button onClick={onCancel}>Cancelar</button>
                    <button onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>
        );
    };

    const handleMusiciansSelect = (selectedIds) => {
        const selected = musicians.filter(musician => selectedIds.includes(musician.id));
        setSelectedMusicians(selected);
    };

    const handleOptionSelected = (e, option) => {
        console.log(option);
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
            if (currentShape) {

            }
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

    // Use useEffect to log the updated lines array
    useEffect(() => {
        console.log('Lines after state update: ', lines);
        console.log('Items after state update: ', items);
    }, [lines, items]);

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

    const handleItemClick = (itemId) => {
        setDraggedItemId(itemId);
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

    const git = (lineId) => {
        const updatedLines = lines.filter((line) => line.id !== lineId);
        setLines(updatedLines);
    };

    return (
        <div>
            <button onClick={handleAddCanvasItemClick}>Percusionistas</button>
            {showAddDialog && (
                <AddCanvasItemDialog
                    musicians={musicians} // Pass your list of musicians here
                    onCancel={() => setShowAddDialog(false)}
                    onConfirm={handleAddMusiciansToCanvas}
                />
            )}
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick} ref={stageRef}>
                <Layer>
                    {/* Render CanvasLines... */}
                    {lines.map((line) => (
                        <CanvasLine
                            key={line.id}
                            startItem={items.find((item) => item.id === line.startItemId)}
                            endItem={items.find((item) => item.id === line.endItemId)}
                        />
                    ))}

                    {/* Render selected musicians' CanvasItems */}
                    {items.map((item) => (
                        <CanvasItem
                            key={item.id}
                            x={item.x || 100}
                            y={item.y || 100}
                            musician_name={item.name}
                            musician_instrument={item.instrument}
                            imageUrl={item.avatar}
                            onDragMove={(e) => handleDragMove(item.id, e.target.x(), e.target.y())}
                            onDragStart={(e) => handleDragStart(e)}
                            onDragEnd={(e) => handleDragEnd(e)}
                            onContextMenu={(e) => handleContextMenu(e, item.id)}
                        />
                    ))}
                </Layer>
                {contextMenuVisible && (
                    <Portal>
                        <ContextMenu
                            position={contextMenuPosition}
                            onOptionSelected={handleOptionSelected}
                        />
                    </Portal>
                )}
            </Stage>
        </div>
    );
};

export default Canvas;
