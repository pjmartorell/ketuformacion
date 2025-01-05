import React from 'react';
import { Rect } from 'react-konva';

interface BackgroundProps {
    width: number;
    height: number;
    color: string;
    name?: string;
}

export const Background: React.FC<BackgroundProps> = ({ width, height, color, name }) => {
    return (
        <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill={color}
            name={name}
        />
    );
};
