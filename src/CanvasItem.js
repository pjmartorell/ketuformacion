import { Circle, Group, Image } from 'react-konva';
import useImage from 'use-image';

const CanvasItem = ({ x, y, imageUrl, onDragStart, onDragEnd, onDragMove, onContextMenu }) => {
    const [image] = useImage(imageUrl);
    const circleRadius = 40;
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
            <Image image={image}
                   width={imageWidth}
                   height={imageHeight}
                   x={-imageWidth / 2}  // Center the image horizontally
                   y={-imageHeight / 2} // Center the image vertically
            />
        </Group>
    );
};

export default CanvasItem;
