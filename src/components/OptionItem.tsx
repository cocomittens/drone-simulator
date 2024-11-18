import React from "react";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <label>
      <h4>{label}</h4>
      <input {...inputProps} />
    </label>
  );
};
