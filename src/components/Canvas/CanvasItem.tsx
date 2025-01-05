import React from 'react';
import { Circle, Group, Image, Text } from 'react-konva';
import { KonvaEventObject } from 'konva/lib/Node';
import useImage from 'use-image';
import { Position, Musician } from '../../types/types';
import { useLongPress } from '../../hooks/useLongPress';
import { storageService } from '../../services/storage';

interface Props {
    x: number;
    y: number;
    musician: Musician;
    imageUrl: string;
    onDragMove: (pos: Position) => void;
    onDragStart: (e: KonvaEventObject<DragEvent>) => void;
    onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
    onContextMenu: (e: KonvaEventObject<MouseEvent>) => void;
    forceHover?: boolean;
}

export const CanvasItem: React.FC<Props> = ({
    x,
    y,
    musician,
    imageUrl: defaultImageUrl,
    onDragMove,
    onDragStart,
    onDragEnd,
    onContextMenu,
    forceHover = false
}) => {
    const [image] = useImage(storageService.getAvatar(musician.name) || defaultImageUrl);
    const circleRadius = 40;
    const fontSize = 13;
    const [hover, setHover] = React.useState(false);
    const [isDragging, setIsDragging] = React.useState(false);

    const longPressHandlers = useLongPress({
        onClick: (e) => {
            if (!isDragging && e) {
                e.evt.preventDefault();
                e.cancelBubble = true;
                onContextMenu(e as KonvaEventObject<MouseEvent>);
            }
        },
        onLongPress: (e) => {
            if (e) {
                e.evt.preventDefault();
                e.cancelBubble = true;
                onContextMenu(e as KonvaEventObject<MouseEvent>);
            }
        },
        ms: 500
    });

    const showHoverEffect = hover || forceHover;

    const { onMouseDown, onMouseUp, onTouchStart, onTouchEnd, onTouchMove } = longPressHandlers.handlers;

    return (
        <Group
            x={x}
            y={y}
            draggable
            onDragMove={(e) => onDragMove({ x: e.target.x(), y: e.target.y() })}
            onDragStart={(e) => {
                setIsDragging(true);
                onDragStart(e);
            }}
            onDragEnd={(e) => {
                setIsDragging(false);
                onDragEnd(e);
            }}
            onContextMenu={(e) => {
                e.evt.preventDefault();
                e.cancelBubble = true;
                onContextMenu(e);
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}
        >
            <Circle
                radius={circleRadius + 2}
                fillLinearGradientStartPoint={{ x: -circleRadius, y: -circleRadius }}
                fillLinearGradientEndPoint={{ x: circleRadius, y: circleRadius }}
                fillLinearGradientColorStops={[0, '#2196f3', 1, '#0d47a1']}
                opacity={showHoverEffect ? 0.8 : 0.4}
                shadowColor="#1976d2"
                shadowBlur={15}
                shadowOpacity={0.3}
            />

            <Circle
                radius={circleRadius}
                fill="white"
                shadowColor="#1976d2"
                shadowBlur={10}
                shadowOpacity={0.2}
                shadowOffset={{ x: 0, y: 2 }}
            />

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

            <Text
                text={musician.name}
                fontSize={fontSize}
                fontStyle="bold"
                fill="#0d47a1"
                align="center"
                width={circleRadius * 2}
                x={-circleRadius}
                y={-circleRadius - 20}
                shadowColor="rgba(255, 255, 255, 0.8)"
                shadowBlur={2}
                shadowOpacity={0.8}
            />

            <Text
                text={musician.instrument}
                fontSize={fontSize}
                fontStyle="bold"
                fill="#0d47a1"
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
