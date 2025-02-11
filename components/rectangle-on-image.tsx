import {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from 'react';

interface RectangleOnImageProps {
  imageUrl: string;
  originalWidth: number;
  originalHeight: number;
  rectX: number;
  rectY: number;
  rectWidth: number;
  rectHeight: number;
  editable?: boolean;
  isMovable?: boolean;
  isPanable?: boolean;
}

export interface RectangleOnImageHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  zoomMax: () => void;
  setBrightnessInPercent: (percent: number) => void;
  setContrastInPercent: (percent: number) => void;
  getRect: () => Annotation | null;
  getZoomLevel: () => number;
}

export interface Annotation {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Scale {
  x: number;
  y: number;
}

export const RectangleOnImage = forwardRef<
  RectangleOnImageHandle,
  RectangleOnImageProps
>(
  (
    { editable = false, isMovable = false, isPanable = false, ...props },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null);
    const [annotation, setAnnotation] = useState<Annotation | null>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [scaled, setScaled] = useState<Scale>({ x: 1, y: 1 });
    const [imageWH, setImageWH] = useState({ width: 0, height: 0 });

    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const image = new Image();
      image.src = props.imageUrl;
      image.onload = () => {
        setImage(image);
      };
    }, [props.imageUrl]);

    // useEffect(() => {
    //   if (props.rectWidth > 0 && props.rectHeight > 0) {
    //     setAnnotation({
    //       x: props.rectX,
    //       y: props.rectY,
    //       width: props.rectWidth,
    //       height: props.rectHeight,
    //     });
    //   }
    // }, [props.rectX, props.rectY, props.rectWidth, props.rectHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;

      if (canvas && container && image) {
        const context = canvas.getContext('2d');

        if (context) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;

          // console.log(
          //   `containerWidth: ${containerWidth}, containerHeight: ${containerHeight}`,
          // );
          // console.log(`imageWidth: ${image.width}, imageHeight: ${image.height}`);

          canvas.width = containerWidth;
          canvas.height = containerHeight;

          const imageRatio = image.width / image.height;
          const canvasRatio = canvas.width / canvas.height;

          let newWidth = canvas.width;
          let newHeight = canvas.height;

          if (imageRatio > canvasRatio) {
            newHeight = Math.floor(canvas.width / imageRatio);
            // newHeight = image.height;
          } else {
            newWidth = Math.floor(canvas.height * imageRatio);
          }

          // console.log(
          //   `imageRatio: ${imageRatio},  canvasRatio: ${canvasRatio},  newWidth: ${newWidth},  newHeight: ${newHeight}, canvasWidth: ${canvas.width} canvasHeight: ${canvas.height}, imageWidth: ${image.width}, imageHeight: ${image.height}`
          // );
          // console.log(`rectX: ${rectX}, rectY: ${rectY}, rectWidth: ${rectWidth}, rectHeight: ${rectHeight}`);

          // Clear the canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.fillStyle = 'rgb(30, 41, 59)'; // Replace with your desired RGB color
          context.fillRect(0, 0, canvas.width, canvas.height);

          // Apply zoom level, brightness and contrast
          context.save();
          context.scale(zoomLevel, zoomLevel);
          context.filter = `brightness(${brightness * 2}%) contrast(${contrast * 2}%)`;

          // // Draw the image on the canvas
          context.drawImage(
            image,
            imagePosition.x,
            imagePosition.y,
            newWidth,
            newHeight,
          );

          setImageWH({ width: newWidth, height: newHeight });

          // if (annotation) {

          // Calculate the scaling factors
          const scaleX = newWidth / image.width;
          const scaleY = newHeight / image.height;

          if (scaleX !== scaled.x || scaleY !== scaled.y) {
            const newAnnotation = {
              x: props.rectX * scaleX,
              y: props.rectY * scaleY,
              width: props.rectWidth * scaleX,
              height: props.rectHeight * scaleY,
            };

            setScaled({ x: scaleX, y: scaleY });
            setAnnotation(newAnnotation);
          }

          // console.log(
          //   `newAnnotation: ${JSON.stringify(annotation)}, scale: ${JSON.stringify(scale)}`,
          // );

          // if (!scale)
          //   setScale({
          //     x: scaleX,
          //     y: scaleY,
          //   });

          // Scale the rectangle's coordinates and dimensions
          // const scaledRectX = Math.floor(newAnnotation.x * scaleX);
          // const scaledRectY = Math.floor(newAnnotation.y * scaleY);
          // const scaledRectWidth = Math.floor(newAnnotation.width * scaleX);
          // const scaledRectHeight = Math.floor(newAnnotation.height * scaleY);

          // console.log(`scaledRectX: ${scaledRectX}, scaledRectY: ${scaledRectY}, scaledRectWidth: ${scaledRectWidth}, scaledRectHeight: ${scaledRectHeight}`);

          // Draw the rectangle
          context.strokeStyle = 'red'; // Set the rectangle color
          context.lineWidth = 2; // Set the rectangle border width
          context.strokeRect(
            annotation ? imagePosition.x + annotation.x : 0,
            annotation ? imagePosition.y + annotation.y : 0,
            annotation ? annotation.width : 0,
            annotation ? annotation.height : 0,
          );
          // }

          context.restore();
        }
      }
    }, [
      image,
      props.rectX,
      props.rectY,
      props.rectWidth,
      props.rectHeight,
      zoomLevel,
      annotation,
      brightness,
      contrast,
      scaled,
      imagePosition,
    ]);

    const getResizeHandle = (x: number, y: number): string | null => {
      if (!annotation) return null;
      const handleSize = 8;
      const { x: rectX, y: rectY, width, height } = annotation;

      console.log(
        `x: ${x}, y: ${y}, rectX: ${rectX}, rectY: ${rectY}, width: ${width}, height: ${height}`,
      );

      if (
        Math.abs(x - rectX) <= handleSize &&
        Math.abs(y - rectY) <= handleSize
      )
        return 'nw';
      if (
        Math.abs(x - (rectX + width)) <= handleSize &&
        Math.abs(y - rectY) <= handleSize
      )
        return 'ne';
      if (
        Math.abs(x - rectX) <= handleSize &&
        Math.abs(y - (rectY + height)) <= handleSize
      )
        return 'sw';
      if (
        Math.abs(x - (rectX + width)) <= handleSize &&
        Math.abs(y - (rectY + height)) <= handleSize
      )
        return 'se';

      return null;
    };

    const isInsideAnnotation = (x: number, y: number): boolean => {
      if (!annotation) return false;
      return (
        x >= annotation.x &&
        x <= annotation.x + annotation.width &&
        y >= annotation.y &&
        y <= annotation.y + annotation.height
      );
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!editable) return;

      // handle panning
      if (isPanable) {
        setIsPanning(true);
        setPanStart({
          x: e.clientX - imagePosition.x,
          y: e.clientY - imagePosition.y,
        });
        return;
      }

      if (zoomLevel !== 1) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      if (isMovable) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const handle = getResizeHandle(x, y);

        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
        } else if (isInsideAnnotation(x, y)) {
          console.log('isDragging');
          setIsDragging(true);
        } else {
          console.log('isDrawing');
          setIsDrawing(true);
        }
        setStartPos({ x, y });
      }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!editable) return;

      // handle panning
      if (isPanable && isPanning) {
        console.log('panning');
        setImagePosition({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (isDrawing) {
        // const width = x - startPos.x;
        // const height = y - startPos.y;
        const width = Math.max(
          0,
          Math.min(x - startPos.x, imageWH.width - startPos.x),
        );
        const height = Math.max(
          0,
          Math.min(y - startPos.y, imageWH.height - startPos.y),
        );

        setAnnotation({
          x: startPos.x,
          y: startPos.y,
          width,
          height,
        });
      } else if (isResizing && annotation) {
        const newAnnotation = { ...annotation };
        switch (resizeHandle) {
          case 'nw':
            // newAnnotation.width += newAnnotation.x - x;
            // newAnnotation.height += newAnnotation.y - y;
            // newAnnotation.x = x;
            // newAnnotation.y = y;
            newAnnotation.width = Math.max(
              0,
              newAnnotation.width + newAnnotation.x - x,
            );
            newAnnotation.height = Math.max(
              0,
              newAnnotation.height + newAnnotation.y - y,
            );
            newAnnotation.x = Math.max(0, x);
            newAnnotation.y = Math.max(0, y);
            break;
          case 'ne':
            // newAnnotation.width = x - newAnnotation.x;
            // newAnnotation.height += newAnnotation.y - y;
            // newAnnotation.y = y;
            newAnnotation.width = Math.max(
              0,
              Math.min(x - newAnnotation.x, imageWH.width - newAnnotation.x),
            );
            newAnnotation.height = Math.max(
              0,
              newAnnotation.height + newAnnotation.y - y,
            );
            newAnnotation.y = Math.max(0, y);
            break;
          case 'sw':
            // newAnnotation.width += newAnnotation.x - x;
            // newAnnotation.height = y - newAnnotation.y;
            // newAnnotation.x = x;
            newAnnotation.width = Math.max(
              0,
              newAnnotation.width + newAnnotation.x - x,
            );
            newAnnotation.height = Math.max(
              0,
              Math.min(y - newAnnotation.y, imageWH.height - newAnnotation.y),
            );
            newAnnotation.x = Math.max(0, x);
            break;
          case 'se':
            // newAnnotation.width = x - newAnnotation.x;
            // newAnnotation.height = y - newAnnotation.y;
            newAnnotation.width = Math.max(
              0,
              Math.min(x - newAnnotation.x, imageWH.width - newAnnotation.x),
            );
            newAnnotation.height = Math.max(
              0,
              Math.min(y - newAnnotation.y, imageWH.height - newAnnotation.y),
            );
            break;
        }
        setAnnotation(newAnnotation);
      } else if (isDragging && annotation) {
        const dx = x - startPos.x;
        const dy = y - startPos.y;

        const newX = Math.max(
          0,
          Math.min(annotation.x + dx, imageWH.width - annotation.width),
        );
        const newY = Math.max(
          0,
          Math.min(annotation.y + dy, imageWH.height - annotation.height),
        );

        setAnnotation({
          ...annotation,
          x: newX,
          y: newY,
        });
        setStartPos({ x, y });
      }
    };

    const handleMouseUp = () => {
      if (!editable) return;

      // handle panning
      if (isPanning) {
        setIsPanning(false);
        return;
      }

      setIsDrawing(false);
      setIsResizing(false);
      setIsDragging(false);
      setResizeHandle(null);
    };

    const zoomIn = () => {
      setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Max zoom level 3x
    };

    const zoomOut = () => {
      setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom level 0.5x
    };

    const zoomReset = () => {
      setZoomLevel(1);
      setBrightness(100);
      setContrast(100);
      setImagePosition({ x: 0, y: 0 });
    };

    const zoomMax = () => {
      setZoomLevel(3);
    };

    const getRect = () => {
      // convert the annotation coordinates back to the original image size
      if (!annotation || !scaled) return null;

      const x = Math.floor(annotation.x / scaled.x);
      const y = Math.floor(annotation.y / scaled.y);
      const width = Math.floor(annotation.width / scaled.x);
      const height = Math.floor(annotation.height / scaled.y);
      const newAnnotation = { x, y, width, height };

      return newAnnotation;
    };

    const setBrightnessInPercent = (percent: number) => {
      if (percent < 0 || percent > 100) return;
      setBrightness(percent);
    };

    const setContrastInPercent = (percent: number) => {
      console.log(`percent: ${percent}`);
      if (percent < 0 || percent > 100) return;
      setContrast(percent);
    };

    useImperativeHandle(ref, () => ({
      zoomIn,
      zoomOut,
      zoomReset,
      zoomMax,
      getRect,
      setBrightnessInPercent,
      setContrastInPercent,
      getZoomLevel: () => zoomLevel,
    }));

    console.log(`contrast: ${contrast}`);

    return (
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          display: 'block',
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={(e) => handleMouseMove(e)}
          onMouseUp={() => handleMouseUp()}
          onMouseLeave={() => handleMouseUp()}
          style={{ cursor: isPanning ? 'grab' : 'default' }}
        />
      </div>
    );
  },
);

RectangleOnImage.displayName = 'RectangleOnImage';
