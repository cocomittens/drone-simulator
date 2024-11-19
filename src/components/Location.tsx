import { OptionGroup } from "./OptionGroup.tsx";
import { OptionItem } from "./OptionItem.tsx";
import { Label } from "@/components/ui/label";
import "../index.css";

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

  const data: Array<{
    label: string;
    type: string;
    value?: any;
    onChange?: (e: any) => void;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }> = [
    {
      label: "Row",
      type: "number",
      value: props.dronePosition[0],
      onChange: rowChange,
    },
    {
      label: "Col",
      type: "number",
      value: props.dronePosition[1],
      onChange: colChange,
    },
  ];

  data.push(
    props.directions.map((direction) => {
      return {
        type: "button",
        text: direction,
        onClick: () => {
          props.setDroneDirection(direction);
        },
        disabled: props.isMoving,
        className: `directionButton w-10 h-10 bg-white text-gray-900 ${
          (!props.originalPosition && props.droneDirection === direction) ||
          (props.originalPosition && props.originalPosition[2] === direction)
            ? "active"
            : "inactive"
        }`,
      };
    })
  );

  return (
    <OptionGroup title="Location" inputData={data}>
      {data.map((data) =>
        Array.isArray(data) ? (
          <div className="flex flex-col justify-evenly">
            <Label>Modes</Label>
            <div className="flex justify-evenly">
              {data.map((item) => (
                <OptionItem {...item} />
              ))}
            </div>
          </div>
        ) : (
          <OptionItem {...data} />
        )
      )}
    </OptionGroup>
  );
};
