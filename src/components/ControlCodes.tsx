import React from "react";
import { OptionItem } from "./OptionItem.tsx";
import "../styles.css";

export const ControlCodes = (props) => {
  const controlCodeChange = (e) => {
    props.setControlCodes(e.target.value);
  };

  const windChange = () => props.setWindDisabled(!props.windDisabled);

  return (
    <div className="inputForm">
      <h3>Control Codes</h3>
      <div className="parameters" id="controls">
        <button
          onClick={() => {
            props.setMode("m");
          }}
          disabled={props.isMoving}
        >
          <span>Manual</span>
        </button>
        <button
          onClick={() => {
            props.setMode("d");
          }}
          disabled={props.isMoving}
        >
          <span>Delivery</span>
        </button>

        <OptionItem
          label="Control codes"
          type="text"
          value={props.controlCodes}
          disabled={props.isMoving || props.mode === "d"}
          onChange={controlCodeChange}
        />
        {props.mode === "m" && (
          <OptionItem
            label="Disable wind"
            type="checkbox"
            checked={props.windDisabled}
            disabled={props.isMoving}
            onChange={windChange}
          />
        )}
      </div>
    </div>
  );
};
