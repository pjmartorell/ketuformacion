import React, { useState, useRef } from 'react';
import {Stage, Layer} from 'react-konva';
import Konva from 'konva';
import CanvasItem from './CanvasItem';
import CanvasLine from './CanvasLine';
import logo from './logo.svg';
import Portal from "./Portal";
import ContextMenu from "./ContextMenu";

const Canvas = () => {
    const [items, setItems] = useState([]);
    const [lines, setLines] = useState([]);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [firstItemId, setFirstItemId] = useState(null);
    const [avatarImage] = useState(logo);

    const circleWidth = 80; // Set the width of the circle, radius * 2
    const spacing = 20; // Set the desired spacing between circles


    const stageRef = useRef(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [currentShape, setCurrentShape] = useState(null);

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



    const addCanvasItem = () => {
        console.log('Adding a canvas item...');

        const newItem = {
            id: Date.now(),
            x: 100 + (items.length * (circleWidth + spacing)),
            y: 100, // Set initial y-coordinate
        };

        if (items.length === 0) {
            setFirstItemId(newItem.id); // Store the ID of the first item
            console.log('First item ID: ', newItem.id)
        }

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
    };

    const addLineConnection = (endId) => {
        console.log('Adding a line connection...')
        if (firstItemId !== null) {
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

            console.log('Start point: ', startCoords)
            console.log('End point: ', endCoords)

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
            <button onClick={addCanvasItem}>Add Canvas Item</button>
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick} ref={stageRef}>
                <Layer>
                    {lines.map((line) => (
                        <CanvasLine
                            key={line.id}
                            startItem={items.find((item) => item.id === line.startItemId)}
                            endItem={items.find((item) => item.id === line.endItemId)}
                        />
                    ))}

                    {items.map((item) => (
                        <CanvasItem
                            key={item.id}
                            x={item.x}
                            y={item.y}
                            imageUrl={avatarImage}
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
