import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";

const canvasWidth = 4000;
const canvasHeight = 3000;

type Point = {
  x: number;
  y: number;
};

export const getCanvasPoint = (
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
) => {
  let point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  point = point.matrixTransform(svg.getScreenCTM()?.inverse());
  return {
    x: point.x,
    y: point.y,
  };
};

const Polyline = ({ points }: { points: Point[]; key?: any }) => {
  try {
    const pathData = useMemo(() => {
      return points.map((p) => `${p.x},${p.y}`).join(" ");
    }, [points]);
    return (
      <polyline
        fill="none"
        strokeWidth={2}
        points={pathData}
        stroke="#666666"
      />
    );
  } catch (error) {}
};

export const Canvas = (props) => {
  const canvasRef = useRef<SVGSVGElement>(null);

  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[] | null>(null);
  const [pointerEventCache, setpointerEventCache] = useState<Number[]>([]);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    //cache pointer event
    setpointerEventCache(
      pointerEventCache.push(event)
      //   console.log(pointerEventCache)
    );

    const start = getCanvasPoint(
      canvasRef.current,
      event.clientX,
      event.clientY
    );
    setCurrentStroke([start]);
    const handlePointerMove = (event: PointerEvent) => {
      if (pointerEventCache.length > 1) {
        const movementPair = {
          movementX: event.movementX,
          movementY: event.movementY,
        };

        props.onMultiTouch(movementPair);

        return;
      }
      const point = getCanvasPoint(
        canvasRef.current,
        event.clientX,
        event.clientY
      );
      setCurrentStroke((x) => [...x, point]);
    };
    const handlePointerUp = (event: PointerEvent) => {
      //remove pointerevent from cache
      //   console.log(event);

      const currentPointerEventCache = pointerEventCache;
      const index = currentPointerEventCache.findIndex(
        (id) => id == event.pointerId
      );
      currentPointerEventCache.splice(index, 1);

      setpointerEventCache(currentPointerEventCache);

      setCurrentStroke((x) => {
        setStrokes((strokes) => [...strokes, x]);
        return null;
      });
      document
        .getElementById("svg-canvas")
        .removeEventListener("pointermove", handlePointerMove);
      document
        .getElementById("svg-canvas")
        .removeEventListener("pointerup", handlePointerUp);
      document
        .getElementById("svg-canvas")
        .removeEventListener("pointercancel", handlePointerUp);
    };
    // const handlePointerDown=(event:TouchEvent)=>{
    //     console.log(event)
    // }
    document
      .getElementById("svg-canvas")
      .addEventListener("pointermove", handlePointerMove);
    document
      .getElementById("svg-canvas")
      .addEventListener("pointerup", handlePointerUp);
    document
      .getElementById("svg-canvas")
      .addEventListener("pointercancel", handlePointerUp);

    //added for touch support
    // document.addEventListener('touchmove', handlePointerMove)
    // document.addEventListener('touchend', handlePointerUp)
    // document.addEventListener('touchcancel', handlePointerUp)
  }, []);

  return (
    <svg
      id="svg-canvas"
      className="main-canvas"
      width={canvasWidth}
      height={canvasHeight}
      ref={canvasRef}
      onPointerDown={handlePointerDown}
    >
      {strokes.map((x, i) => (
        <Polyline points={x} key={i} />
      ))}
      {currentStroke ? <Polyline points={currentStroke} /> : null}
    </svg>
  );
};
