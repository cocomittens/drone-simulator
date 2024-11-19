import { OptionGroup } from "./OptionGroup.tsx";
import "../index.css";

export const ControlCodes = (props) => {
  const controlCodeChange = (e) => {
    props.setControlCodes(e.target.value);
  };

  const windChange = () => props.setWindDisabled(!props.windDisabled);
  const data = [
    {
      type: "button",
      label: "Modes",
      text: "Manual",
      onClick: () => props.setMode("m"),
      disabled: props.isMoving,
    },
    {
      type: "button",
      text: "Delivery",
      onClick: () => props.setMode("d"),
      disabled: props.isMoving,
    },
    {
      label: "Control codes",
      type: "text",
      value: props.controlCodes,
      disabled: props.isMoving || props.mode === "d",
      onChange: controlCodeChange,
    },
    {
      label: "Disable wind",
      type: "checkbox",
      checked: props.windDisabled,
      disabled: props.isMoving || props.mode === "d",
      onChange: windChange,
    },
  ];

  return <OptionGroup title="Control Codes" inputData={data} />;
};
