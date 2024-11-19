import { OptionGroup } from "./OptionGroup.tsx";
import "../index.css";

export const ControlCodes = (props) => {
  const controlCodeChange = (e) => {
    props.setControlCodes(e.target.value);
  };

  const windChange = () => props.setWindDisabled(!props.windDisabled);
  const data = [
    { type: "label", label: "Modes" },
    {
      type: "button",
      text: "Manual",
      onClick: () => props.setMode("m"),
      disabled: props.isMoving,
      className: "border-violet-600 w-30",
    },
    {
      type: "button",
      text: "Delivery",
      onClick: () => props.setMode("d"),
      disabled: props.isMoving,
      className: "border-violet-600",
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
      className: "accent-violet-600 size-6",
    },
  ];

  return <OptionGroup title="Control Codes" inputData={data} />;
};
