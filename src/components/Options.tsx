import React from "react";

import { Dimensions } from "./Dimensions.tsx";
import { Location } from "./Location.tsx";
import { ControlCodes } from "./ControlCodes.tsx";
import { useDrone } from "../context/drone.js";
import { DIRECTIONS } from "../constants.ts";

import "../styles.css";

export const Options = (props) => {
  const {
    dronePosition,
    setDronePosition,
    droneDirection,
    setDroneDirection,
    originalPosition,
    setOriginalPosition,
    isMoving,
  } = useDrone();

  return (
    <div id="options-container">
      <h2>Grid Options</h2>
      <div id="options">
        <div className="directionLocation">
          <Dimensions
            isMoving={isMoving}
            gridDimensions={props.gridDimensions}
            treeProbability={props.treeProbability}
            setGridDimensions={props.setGridDimensions}
            setTreeProbability={props.setTreeProbability}
          />
          <Location
            isMoving={isMoving}
            dronePosition={dronePosition}
            directions={DIRECTIONS}
            droneDirection={droneDirection}
            originalPosition={originalPosition}
            setDroneDirection={setDroneDirection}
            setDronePosition={setDronePosition}
            gridDimensions={props.gridDimensions}
          />
          <ControlCodes
            windDisabled={props.windDisabled}
            mode={props.mode}
            isMoving={props.isMoving}
            controlCodes={props.controlCodes}
            setControlCodes={props.setControlCodes}
            setMode={props.setMode}
            setWindDisabled={props.setWindDisabled}
          />
        </div>

        <button
          onClick={async () => {
            setOriginalPosition(props.dronePosition);
            await props.executeDelivery();
          }}
          disabled={isMoving}
        >
          <span>{props.mode === "d" ? "Delivery" : "Execute"}</span>
        </button>
      </div>
    </div>
  );
};
