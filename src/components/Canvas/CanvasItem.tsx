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
    const fontSize = 13;
    const [hover, setHover] = React.useState(false);

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
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* Outer glowing ring */}
            <Circle
                radius={circleRadius + 2}
                fillLinearGradientStartPoint={{ x: -circleRadius, y: -circleRadius }}
                fillLinearGradientEndPoint={{ x: circleRadius, y: circleRadius }}
                fillLinearGradientColorStops={[0, '#2196f3', 1, '#0d47a1']}
                opacity={hover ? 0.8 : 0.4}
                shadowColor="#1976d2"
                shadowBlur={15}
                shadowOpacity={0.3}
            />

            {/* Main circle */}
            <Circle
                radius={circleRadius}
                fill="white"
                shadowColor="#1976d2"
                shadowBlur={10}
                shadowOpacity={0.2}
                shadowOffset={{ x: 0, y: 2 }}
            />

            {/* Image container */}
            <Group
                clipFunc={(ctx) => {
                    ctx.arc(0, 0, circleRadius - 2, 0, Math.PI * 2, false);
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

            {/* Name label */}
            <Text
                text={musician.name}
                fontSize={fontSize}
                fontStyle="bold"
                fill="#0d47a1"  // Dark blue from the theme
                align="center"
                width={circleRadius * 2}
                x={-circleRadius}
                y={-circleRadius - 20}
                shadowColor="rgba(255, 255, 255, 0.8)"
                shadowBlur={2}
                shadowOpacity={0.8}
            />

            {/* Instrument label */}
            <Text
                text={musician.instrument}
                fontSize={fontSize}
                fontStyle="bold"
                fill="#0d47a1"  // Dark blue from the theme
                align="center"
                width={circleRadius * 2}
                x={-circleRadius}
                y={circleRadius + 8}
                shadowColor="rgba(255, 255, 255, 0.8)"
                shadowBlur={2}
                shadowOpacity={0.8}
            />
        </Group>
    );
};
