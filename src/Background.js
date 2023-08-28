import React from 'react';
import { Rect, Layer } from 'react-konva';

const Background = ({ width, height, color }) => {
    return (
        <Layer>
            <Rect width={width} height={height} fill={color} />
        </Layer>
    );
};

export default Background;
