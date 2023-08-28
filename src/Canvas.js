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

        const handleDeselectAll = () => {
            setSelectedMusicians([]);
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
                    <button onClick={handleDeselectAll}>Deseleccionar todos</button>
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

    const calculateContentBoundsRecursive = (node) => {
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        const traverseChildren = (currentNode) => {
            // Skip lines when calculating bounds
            if (!(currentNode instanceof Konva.Line)) {
                const nodePos = currentNode.getAbsolutePosition();
                const nodeSize = currentNode.getSize();
                let nodePosX = nodePos.x;
                let nodePosY = nodePos.y;

                // Rectangle-like shapes has origin at TOP LEFT (Rectangle, Sprite, Text, Image, etc), but Circles have
                // their position at the center, so we need to adjust the coordinates
                if (currentNode instanceof Konva.Circle) {
                    nodePosX -= nodeSize.width / 2;
                    nodePosY -= nodeSize.height / 2;
                }

                // Update min and max coordinates
                minX = Math.min(minX, nodePosX);
                minY = Math.min(minY, nodePosY);
                maxX = Math.max(maxX, nodePosX + nodeSize.width);
                maxY = Math.max(maxY, nodePosY + nodeSize.height);

                // console.log('Node: ', currentNode)
                // console.log('Node pos: ', nodePos)
                // console.log('Node size: ', nodeSize)
            }

            if (currentNode.getChildren) {
                currentNode.getChildren().forEach((childNode) => {
                    traverseChildren(childNode);
                });
            }
        };

        node.getChildren().forEach((childNode) => {
            traverseChildren(childNode);
        });

        console.log('Content bounds: ', { minX, minY, maxX, maxY })
        return { minX, minY, maxX, maxY };
    };

    const downloadDataURL = (dataURL, filename) => {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handles exporting the canvas as an image removing empty space, that is, calculating the bounding box of all shapes
    const handleExportCanvas = () => {
        const stage = stageRef.current.getStage();
        const originalScale = stage.scaleX();

        // Temporarily set the scale to the default 1 for exporting
        stage.scale({ x: 1, y: 1 });
        stage.batchDraw();

        // Re-fetch the layer after changing the scale and re-calculate content bounds
        let layer = stage.getChildren((node) => node.getClassName() === 'Layer')[0];
        let contentBounds = calculateContentBoundsRecursive(layer);

        // Set the stage position to the top left corner of the content bounds so we ensure all shapes are inside the
        // limits of the stage and are not cropped
        const originalStagePosition = stage.position();
        const newPos = {
            x: contentBounds.minX,
            y: contentBounds.minY,
        };
        stage.position(newPos);
        stage.batchDraw();

        // Re-fetch the layer after changing the stage position and re-calculate content bounds. Probably content bounds
        // can be calculated without re-fetching the layer nor re-calculating the bounds, but this works for now
        layer = stage.getChildren((node) => node.getClassName() === 'Layer')[0];
        contentBounds = calculateContentBoundsRecursive(layer);

        const pixelRatio = 3; // Increase pixel ratio to improve image quality
        const margin = 10; // Margin to add to the canvas size

        // Create a canvas element with the calculated size, corresponding to the content bounds
        const canvas = document.createElement('canvas');
        canvas.width = (contentBounds.maxX - contentBounds.minX  + 2 * margin) * pixelRatio;
        canvas.height = (contentBounds.maxY - contentBounds.minY  + 2 * margin) * pixelRatio;
        const context = canvas.getContext('2d');

        const source_xy = [(contentBounds.minX - margin) * pixelRatio, (contentBounds.minY - margin) * pixelRatio]
        const source_wh =  [(canvas.width + 2 * margin) * pixelRatio, (canvas.height + 2 * margin) * pixelRatio]
        const dest_xy = [0, 0]
        const dest_wh = [(canvas.width + 2 * margin) * pixelRatio, (canvas.height  + 2 * margin) * pixelRatio]

        // const rect = drawBoundingRectangle(stage, layer, contentBounds);

        const originalCanvasElement = stage.toCanvas({ pixelRatio: pixelRatio }); // Reference to the original canvas element

        // Remove the rectangle shape from the layer
        // rect.remove();
        // layer.batchDraw();

        context.drawImage(
            originalCanvasElement,
            ...source_xy,
            ...source_wh,
            ...dest_xy,
            ...dest_wh
        );

        // Export the content of the canvas as an image
        const dataURL = canvas.toDataURL();

        // Restore the original stage position
        stage.position(originalStagePosition);

        // Restore the original scale
        stage.scale({ x: originalScale, y: originalScale });
        stage.batchDraw();

        downloadDataURL(dataURL, 'canvas.png');

        // console.log('Stage position: ', stage.position())
    };

    // Draws a bounding rectangle around all shapes on the stage
    const drawBoundingRectangle = (stage, layer, contentBounds) => {
        // Adjust the content bounds to account for the stage position after dragging
        contentBounds = {
            minX: contentBounds.minX - stage.position().x,
            minY: contentBounds.minY - stage.position().y,
            maxX: contentBounds.maxX - stage.position().x,
            maxY: contentBounds.maxY - stage.position().y,
        }
        const rectX = contentBounds.minX;
        const rectY = contentBounds.minY;
        const rectWidth = contentBounds.maxX - contentBounds.minX;
        const rectHeight = contentBounds.maxY - contentBounds.minY;

        // Create a Konva Rect shape for the bounding rectangle
        const rect = new Konva.Rect({
            x: rectX,
            y: rectY,
            width: rectWidth,
            height: rectHeight,
            stroke: 'red',
            strokeWidth: 4,
        });

        // Add the rectangle shape to the layer
        layer.add(rect);
        layer.batchDraw();
        return rect;
    }

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

    // Add event listener to the stage to handle zooming
    useEffect(() => {
        const stage = stageRef.current.getStage();

        const handleWheel = (e) => {
            e.evt.preventDefault();

            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            let direction = e.evt.deltaY > 0 ? 1 : -1;

            if (e.evt.ctrlKey) {
                direction = -direction;
            }

            // Calculate the new scale limiting it to a range of 0.3 to 2.6
            const newScale = Math.max(0.3, Math.min(2.6, oldScale * (direction > 0 ? 1.1 : 1 / 1.1)));

            stage.scale({ x: newScale, y: newScale });

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            stage.position(newPos);

            stage.batchDraw();
        };

        stage.on('wheel', handleWheel);

        return () => {
            stage.off('wheel', handleWheel);
        };
    }, []);

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

            {/*Set stage width and height so it fits the viewport size when zooming out to 0.3 scale*/}
            <Stage width={window.innerWidth/0.3} height={window.innerHeight/0.3} onClick={handleStageClick} ref={stageRef} draggable>
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
