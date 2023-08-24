import {Circle, Group, Image, Text} from 'react-konva';
import useImage from 'use-image';
import React from "react";

const CanvasItem = ({ x, y, musician_name, musician_instrument, imageUrl, onDragStart, onDragEnd, onDragMove, onContextMenu }) => {
    const [image] = useImage(imageUrl);
    const circleRadius = 40;
    const circleWidth = circleRadius * 2;
    const imageWidth = 110;
    const imageHeight = 80;

    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragStart={onDragStart} onDragEnd={onDragEnd} onContextMenu={onContextMenu}>
            <Circle
                radius={circleRadius}
                fill="red"
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
            />
            <Group
                clipFunc={(ctx) => {
                    // circular clipping path centered at (0, 0)
                    ctx.arc(0, 0, circleRadius, 0, Math.PI * 2, false);
                }}
            >
                <Image image={image}
                       width={imageWidth}
                       height={imageHeight}
                       x={-imageWidth / 2}  // Center the image horizontally
                       y={-imageHeight / 2} // Center the image vertically
                />
            </Group>
            <Text text={musician_name} x={-circleRadius} y={-circleRadius} align="center" width={circleWidth} />
            <Text text={musician_instrument} x={-circleRadius} y={circleRadius - 10} align="center" width={circleWidth} />
        </Group>
    );
};

export default CanvasItem;
