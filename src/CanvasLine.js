import React from 'react';
import { Line } from 'react-konva';

const CanvasLine = ({ startItem, endItem }) => {
    if (!startItem || !endItem) {
        return null;
    }

    // If the endItem has no x or y, we set it to 100 so the line is drawn to the default position of CanvasItems
    return (
        <Line
            points={[startItem.x, startItem.y, endItem.x || 100, endItem.y || 100]}
            stroke="black"
        />
    );
};

export default CanvasLine;