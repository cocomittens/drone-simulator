import "../index.css";

import { OptionGroup } from "./OptionGroup.tsx";
import { OptionItem } from "./OptionItem.tsx";

export const Dimensions = (props) => {
  const rowsChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      props.setGridDimensions([
        value === "" ? 0 : Number(value),
        props.gridDimensions[1],
      ]);
    }
  };

  const colsChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      props.setGridDimensions([
        props.gridDimensions[0],
        value === "" ? 0 : Number(value),
      ]);
    }
  };

  const treeProbChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 1)) {
      props.setTreeProbability(value === "" ? NaN : Number(value));
    }
  };

  const treeProbBlur = () => {
    if (isNaN(props.treeProbability)) {
      props.setTreeProbability(0);
    }
  };

  const data = [
    {
      id: "rows",
      label: "Rows",
      type: "number",
      value: props.gridDimensions[0] === 0 ? "" : props.gridDimensions[0],
      onChange: rowsChange,
    },
    {
      label: "Cols",
      type: "number",
      value: props.gridDimensions[1] === 0 ? "" : props.gridDimensions[1],
      onChange: colsChange,
    },
    {
      label: "Tree Probability",
      type: "number",
      step: "0.1",
      value: isNaN(props.treeProbability) ? "" : props.treeProbability,
      onChange: treeProbChange,
      onBlur: treeProbBlur,
    },
  ];
  return (
    <OptionGroup title="Dimensions" inputData={data}>
      {data.map((data) =>
        Array.isArray(data) ? (
          <div className="flex justify-evenly">
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
