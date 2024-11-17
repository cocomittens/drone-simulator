import React from "react";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <label>
      <p style={{ marginBottom: "1vh" }}>{label}</p>
      <input {...inputProps} />
    </label>
  );
};
