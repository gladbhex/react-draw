import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "./Canvas";
type movement = {
  movementX: number;
  movementY: number;
};
export const ScrollContainer = () => {
  const ref = useRef(null);
  const [touchAction, setTouchAction] = useState("auto");

  let el = null;
  useEffect(() => {
    el = document.getElementById("canvas");
  }, []);
  const handleChangeTouchAction = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTouchAction(event.target.checked ? "auto" : "none");
  };

  const MoveCanvas = (averageScrollPair: movement) => {
    el.scrollTop -= averageScrollPair.movementY;
    el.scrollLeft -= averageScrollPair.movementX;
  };

  return (
    <div
      id="canvas"
      className="scroll-container"
      style={{ touchAction: "none" }}
    >
      <Canvas
        onMultiTouch={(averageScrollPair: movement) =>
          MoveCanvas(averageScrollPair)
        }
      />
      <div className="options">
        <label>
          touch action:{" "}
          <input
            type="checkbox"
            checked={touchAction === "auto"}
            onChange={handleChangeTouchAction}
          />
        </label>
      </div>
    </div>
  );
};
