import "../index.css";

import { OptionGroup } from "./OptionGroup.tsx";

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

  const data = [
    {
      id: "rows",
      label: "Rows",
      type: "number",
      value: props.gridDimensions[0],
      onChange: rowsChange,
    },
    {
      label: "Cols",
      type: "number",
      value: props.gridDimensions[1],
      onChange: colsChange,
    },
    {
      label: "Tree Probability",
      type: "number",
      value: props.treeProbability,
      onChange: treeProbChange,
    },
  ];

  return <OptionGroup title="Dimensions" inputData={data} />;
};
