import React from 'react';
import { Line } from 'react-konva';

const CanvasLine = ({ startItem, endItem }) => {
    if (!startItem || !endItem) {
        return null;
    }

    return (
        <Line
            points={[startItem.x, startItem.y, endItem.x, endItem.y]}
            stroke="black"
        />
    );
};

export default CanvasLine;