import { OptionGroup } from "./OptionGroup.tsx";
import { OptionItem } from "./OptionItem.tsx";
import { Label } from "@/components/ui/label";
import "../index.css";

export const ControlCodes = (props) => {
  const controlCodeChange = (e) => {
    props.setControlCodes(e.target.value);
  };

  const windChange = () => props.setWindDisabled(!props.windDisabled);
  const data = [
    [
      {
        type: "button",
        text: "Manual",
        onClick: () => props.setMode("m"),
        disabled: props.isMoving,
        className: "border-violet-600 w-full",
      },
      {
        type: "button",
        text: "Delivery",
        onClick: () => props.setMode("d"),
        disabled: props.isMoving,
        className: "border-violet-600 mb-2 w-full",
      },
    ],
    {
      label: "Control codes",
      type: "text",
      value: props.controlCodes,
      disabled: props.isMoving || props.mode === "d",
      onChange: controlCodeChange,
      className: "min-w-72 my-2",
    },
    {
      label: "Disable wind",
      type: "checkbox",
      checked: props.windDisabled,
      disabled: props.isMoving || props.mode === "d",
      onChange: windChange,
      className: "accent-violet-600 size-6 mt-2",
    },
  ];

  return (
    <OptionGroup title="Control Codes" inputData={data}>
      {data.map((data) =>
        Array.isArray(data) ? (
          <div className="flex flex-col justify-evenly">
            <Label>Modes</Label>
            {data.map((item) => (
              <OptionItem {...item} />
            ))}
          </div>
        ) : (
          <OptionItem {...data} />
        )
      )}
    </OptionGroup>
  );
};
