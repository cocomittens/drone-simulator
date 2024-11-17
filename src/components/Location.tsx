import React from "react";
import { OptionItem } from "./OptionItem.tsx";
import "../styles.css";

export const Location = (props) => {
  const rowChange = (e) => {
    if (
      Number(e.target.value) >= 0 &&
      Number(e.target.value) < props.gridDimensions[0]
    ) {
      props.setDronePosition([Number(e.target.value), props.dronePosition[1]]);
    }
  };

  const colChange = (e) => {
    if (
      Number(Number(e.target.value) >= 0) &&
      Number(e.target.value) < props.gridDimensions[1]
    ) {
      props.setDronePosition([props.dronePosition[0], Number(e.target.value)]);
    }
  };

  return (
    <div className="inputForm">
      <h3>Drone Location</h3>
      <div className="parameters">
        <div className="directionLocation">
          <OptionItem
            label="Row"
            type="number"
            disabled={props.isMoving}
            value={String(props.dronePosition[0])}
            handleChange={rowChange}
          />
          <OptionItem
            label="Col"
            type="number"
            disabled={props.isMoving}
            value={String(props.dronePosition[1])}
            handleChange={colChange}
          />
        </div>
        <label>
          <p>Direction: </p>
          {props.directions.map((direction) => {
            return (
              <input
                disabled={props.isMoving}
                type="button"
                key={direction}
                className={`directionButton ${
                  (!props.originalPosition &&
                    props.droneDirection === direction) ||
                  (props.originalPosition &&
                    props.originalPosition[2] === direction)
                    ? "active"
                    : "inactive"
                }`}
                onClick={() => {
                  props.setDroneDirection(direction);
                }}
                value={direction}
              ></input>
            );
          })}
        </label>
      </div>
    </div>
  );
};
