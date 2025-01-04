import React from 'react';
import { Circle, Group, Image, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { Position, Musician } from '../../types/types';

interface Props {
    x: number;
    y: number;
    musician: Musician;
    imageUrl: string;
    onDragMove: (pos: Position) => void;
    onDragStart: (e: KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
    onDblClick: (e: KonvaEventObject<MouseEvent>) => void;
}

export const CanvasItem: React.FC<Props> = ({
    x,
    y,
    musician,
    imageUrl,
    onDragMove,
    onDragStart,
    onDragEnd,
    onDblClick
}) => {
    const [image] = useImage(imageUrl);
    const circleRadius = 40;
    const fontSize = 12;

    return (
        <Group
            x={x}
            y={y}
            draggable
            onDragMove={(e) => onDragMove({ x: e.target.x(), y: e.target.y() })}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDblClick={onDblClick}
            onDblTap={onDblClick}
        >
            <Circle
                radius={circleRadius}
                fill="white"
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
            />

            <Group
                clipFunc={(ctx) => {
                    ctx.arc(0, 0, circleRadius, 0, Math.PI * 2, false);
                }}
            >
                {image && (
                    <Image
                        image={image}
                        width={circleRadius * 2}
                        height={circleRadius * 2}
                        x={-circleRadius}
                        y={-circleRadius}
                    />
                )}
            </Group>

            <Text
                text={musician.name}
                fontSize={fontSize}
                fill="white"
                align="center"
                width={circleRadius * 2}
                x={-circleRadius}
                y={-circleRadius - 20}
            />

            <Text
                text={musician.instrument}
                fontSize={fontSize}
                fill="white"
                align="center"
                width={circleRadius * 2}
                x={-circleRadius}
                y={circleRadius + 5}
            />
        </Group>
    );
};
