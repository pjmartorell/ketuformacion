import React from 'react';
import { Layer, Rect } from 'react-konva';

interface Props {
    width: number;
    height: number;
    color: string;
}

export const Background: React.FC<Props> = ({ width, height, color }) => {
    return (
        <Layer>
            <Rect width={width} height={height} fill={color} />
        </Layer>
    );
};
