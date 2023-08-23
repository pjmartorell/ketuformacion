import { Circle, Image } from 'react-konva';
import useImage from 'use-image';

const CanvasItem = ({ x, y, imageUrl, onDragMove, onClick }) => {
    const [image] = useImage(imageUrl);

    return (
        <div>
            <Circle x={x} y={y} radius={40} fill="red" draggable onDragMove={onDragMove} onClick={onClick} />
            <Image image={image} x={x - 40 - 15} y={y - 40} width={50} height={80} />
        </div>
    );
};

export default CanvasItem;
