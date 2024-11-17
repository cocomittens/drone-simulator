import React from "react";

import { Dimensions } from "./Dimensions.tsx";
import { Location } from "./Location.tsx";
import { ControlCodes } from "./ControlCodes.tsx";
import "../styles.css";

export const Options = (props) => {
  return (
    <div id="options-container">
      <h2>Grid Options</h2>
      <div id="options">
        <div className="directionLocation">
          <Dimensions
            isMoving={props.isMoving}
            gridDimensions={props.gridDimensions}
            treeProbability={props.treeProbability}
            setGridDimensions={props.setGridDimensions}
            setTreeProbability={props.setTreeProbability}
          />
          <Location
            isMoving={props.isMoving}
            dronePosition={props.dronePosition}
            directions={props.directions}
            droneDirection={props.droneDirection}
            originalPosition={props.originalPosition}
            setDroneDirection={props.setDroneDirection}
            setDronePosition={props.setDronePosition}
          />
          <ControlCodes
            windDisabled={props.windDisabled}
            mode={props.mode}
            isMoving={props.isMoving}
            controlCodes={props.controlCodes}
            setControlCodes={props.setControlCodes}
            setMode={props.setMode}
          />
        </div>

        <button
          onClick={async () => {
            props.setOriginalPosition(props.dronePosition);
            await props.executeDelivery();
          }}
          disabled={props.isMoving}
        >
          <span>{props.mode === "d" ? "Delivery" : "Execute"}</span>
        </button>
      </div>
    </div>
  );
};
