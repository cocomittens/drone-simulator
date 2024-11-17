import React, { createContext, useContext, useState } from "react";
import { isValid } from "../util/util";

const DroneContext = createContext();

export const useDrone = () => {
  const context = useContext(DroneContext);
  if (!context) {
    throw new Error("useDrone must be used within a DroneProvider");
  }
  return context;
};

export const DroneProvider = ({ children }) => {
  const [dronePosition, setDronePosition] = useState([1, 1]);
  const [droneDirection, setDroneDirection] = useState("n");
  const [destination, setDestination] = useState(null);
  const [originalPosition, setOriginalPosition] = useState(null);
  const [battery, setBattery] = useState(100);
  const [isMoving, setIsMoving] = useState(false);

  const moveDrone = (newPosition, grid, isWind = false) => {
    const [row, col] = newPosition;
    if (isValid([row, col], grid)) {
      setDronePosition(newPosition);
    } else {
      if (isWind) {
        alert("OH NO!");
        resetGrid();
      } else {
        alert("Cannot move forward");
      }
    }
  };

  const resetGrid = () => {
    setIsMoving(false);
    setDronePosition(originalPosition);
  };

  const value = {
    dronePosition,
    setDronePosition,
    droneDirection,
    setDroneDirection,
    destination,
    setDestination,
    originalPosition,
    setOriginalPosition,
    battery,
    setBattery,
    isMoving,
    setIsMoving,
    moveDrone,
    resetGrid,
  };

  return (
    <DroneContext.Provider value={value}>{children}</DroneContext.Provider>
  );
};
