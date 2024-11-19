import { Dimensions } from "./Dimensions.tsx";
import { Location } from "./Location.tsx";
import { ControlCodes } from "./ControlCodes.tsx";
import { useDrone } from "../context/drone.jsx";
import { DIRECTIONS } from "../constants.ts";
import { Button } from "@/components/ui/button";

import "../index.css";

export const Options = (props) => {
  const {
    dronePosition,
    setDronePosition,
    droneDirection,
    setDroneDirection,
    originalPosition,
    setOriginalPosition,
    isMoving,
  } = useDrone();

  return (
    <div id="options-container">
      <h2 className="text-xl font-semibold mb-2">Grid Options</h2>
      <div className="grid lg:grid-cols-12 md:grid-cols-2 sm:grid-cols-1 gap-4">
        <div className="lg:col-span-3">
          <Dimensions
            isMoving={isMoving}
            gridDimensions={props.gridDimensions}
            treeProbability={props.treeProbability}
            setGridDimensions={props.setGridDimensions}
            setTreeProbability={props.setTreeProbability}
          />
        </div>
        <div className="lg:col-span-6">
          <ControlCodes
            windDisabled={props.windDisabled}
            mode={props.mode}
            isMoving={props.isMoving}
            controlCodes={props.controlCodes}
            setControlCodes={props.setControlCodes}
            setMode={props.setMode}
            setWindDisabled={props.setWindDisabled}
          />
        </div>
        <div className="lg:col-span-3">
          <Location
            isMoving={isMoving}
            dronePosition={dronePosition}
            directions={DIRECTIONS}
            droneDirection={droneDirection}
            originalPosition={originalPosition}
            setDroneDirection={setDroneDirection}
            setDronePosition={setDronePosition}
            gridDimensions={props.gridDimensions}
          />
        </div>
      </div>

      <Button
        onClick={async () => {
          setOriginalPosition(props.dronePosition);
          await props.executeDelivery();
        }}
        disabled={isMoving}
        className="bg-violet-600 mt-4 w-1/4"
      >
        <span>{props.mode === "d" ? "Delivery" : "Execute"}</span>
      </Button>
    </div>
  );
};
