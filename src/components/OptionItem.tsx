import React from "react";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <label>
      <p>{label}: </p>
      <input {...inputProps} />
    </label>
  );
};
