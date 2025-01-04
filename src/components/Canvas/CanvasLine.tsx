import React from 'react';
import { Line } from 'react-konva';
import { CanvasItem } from '../../types/types';

interface Props {
    startItem?: CanvasItem;
    endItem?: CanvasItem;
}

export const CanvasLine: React.FC<Props> = ({ startItem, endItem }) => {
    if (!startItem || !endItem) return null;

    return (
        <Line
            points={[
                startItem.x,
                startItem.y,
                endItem.x,
                endItem.y
            ]}
            stroke="black"
            strokeWidth={1}
            opacity={0.5}
        />
    );
};
