import React from "react";
import { OptionItem } from "./OptionItem.tsx";
import "../styles.css";

export const Dimensions = (props) => {
  const rowsChange = (e) => {
    if (Number(e.target.value) > 0) {
      props.setGridDimensions([e.target.value, props.gridDimensions[1]]);
    }
  };

  const colsChange = (e) => {
    if (Number(e.target.value) > 0) {
      props.setGridDimensions([props.gridDimensions[0], e.target.value]);
    }
  };

  const treeProbChange = (e) => {
    if (Number(e.target.value) > 0 && Number(e.target.value) <= 1) {
      props.setTreeProbability(e.target.value);
    }
  };

  return (
    <div className="inputForm">
      <h3>Dimensions</h3>
      <div className="parameters">
        <div className="directionLocation">
          <OptionItem
            label="Rows"
            type="number"
            disabled={props.isMoving}
            value={props.gridDimensions[0]}
            handleChange={rowsChange}
          />
          <OptionItem
            label="Cols"
            type="number"
            disabled={props.isMoving}
            value={props.gridDimensions[1]}
            handleChange={colsChange}
          />
        </div>
        <OptionItem
          label="Tree Probability"
          type="number"
          disabled={props.isMoving}
          value={props.treeProbability}
          handleChange={treeProbChange}
        />
      </div>
    </div>
  );
};
