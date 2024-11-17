import React from "react";
import "../styles.css";

export const DroneGrid = (props) => {
  return (
    <>
      <div id="battery">
        <span>{props.battery}%</span>
      </div>
      <div id="grid-container">
        <div
          id="grid"
          style={{
            gridTemplateColumns: `repeat(${props.gridDimensions[1]}, 1fr)`,
            gridTemplateRows: `repeat(${props.gridDimensions[0]}, 1fr)`,
          }}
        >
          {props.renderGrid()}
        </div>
      </div>
    </>
  );
};
