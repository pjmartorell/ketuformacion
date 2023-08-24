import {Circle, Group, Image, Rect, Text} from 'react-konva';
import useImage from 'use-image';
import React from "react";

const CanvasItem = ({ x, y, musician_name, musician_instrument, imageUrl, onDragStart, onDragEnd, onDragMove, onDblClick }) => {
    const [image] = useImage(imageUrl);
    const circleRadius = 40;
    const circleWidth = circleRadius * 2;
    const imageWidth = 80;
    const imageHeight = 80;
    const fontSize = 12;
    const padding = 4;
    // Calculate the width and height needed for the rectangle to bound the text
    const textWidth = musician_name.length * fontSize * 0.6;
    const textHeight = fontSize;

    return (
        <Group x={x} y={y} draggable onDragMove={onDragMove} onDragStart={onDragStart} onDragEnd={onDragEnd} onDblClick={onDblClick}>
            <Circle
                radius={circleRadius}
                fill="white"
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
                // stroke="blue"      // Add a yellow stroke/border
                // strokeWidth={8} // Set the border width
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
            <Group>
                <Rect
                    x={ - textWidth / 2 - padding}
                    y={-circleRadius - 5 - padding}
                    width={textWidth + padding * 2}
                    height={textHeight + padding * 2}
                    cornerRadius={10}
                    fillLinearGradientStartPoint={{ x: -50, y: -50 }}
                    fillLinearGradientEndPoint={{ x: 50, y: 50 }}
                    fillLinearGradientColorStops={[0.3, 'blue', 1, 'aquamarine']}
                    // fillLinearGradientColorStops={[0.1, 'red', 1, 'yellow']}
                    // shadowColor="black"
                    // shadowBlur={10}
                    // shadowOpacity={0.6}
                />
                <Text
                    text={musician_name}
                    x={-circleRadius}
                    y={-circleRadius - 5}
                    align="center"
                    width={circleWidth}
                    fill="white"
                />
            </Group>
            <Group>
                <Circle
                    // fill="blue"
                    x={0}
                    y={circleRadius}
                    radius={10}
                    fillLinearGradientStartPoint={{ x: 0, y: circleRadius }} // Bottom center of the circle
                    fillLinearGradientEndPoint={{ x: 0, y: -circleRadius }} // Top center of the circle
                    fillLinearGradientColorStops={[0.3, 'blue', 1, 'aquamarine']}
                    // shadowColor="black"
                    // shadowBlur={10}
                    // shadowOpacity={0.6}
                />
                <Text
                    text={musician_instrument}
                    x={-circleRadius}
                    y={circleRadius - 5}
                    align="center"
                    width={circleWidth}
                    fill="white"
                />
            </Group>
        </Group>
    );
};

export default CanvasItem;
