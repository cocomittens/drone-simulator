import { Dimensions } from "./Dimensions.tsx";
import { Location } from "./Location.tsx";
import { ControlCodes } from "./ControlCodes.tsx";
import { useDrone } from "../context/drone.jsx";
import { DIRECTIONS } from "../constants.ts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

import "../index.css";

import { generateGrid } from "../util/util";

export const Options = (props) => {
  const {
    dronePosition,
    setDronePosition,
    droneDirection,
    setDroneDirection,
    originalPosition,
    setOriginalPosition,
    isMoving,
    battery,
  } = useDrone();

  return (
    <Card id="options-container" className="p-1">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Grid Options</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter className="w-full flex justify-center">
        <Button
          onClick={async () => {
            setOriginalPosition(props.dronePosition);
            console.log(props.mode);
            if (props.mode === "d") {
              await props.executeDelivery();
            } else {
              const { grid } = generateGrid(
                props.dronePosition,
                props.gridDimensions,
                props.treeProbability
              );
              props.setDroneGrid(grid);
              console.log(
                props.dronePosition,
                props.controlCodes,
                grid,
                battery
              );
              await props.executeControlCodes(
                props.dronePosition,
                props.controlCodes,
                grid,
                battery
              );
            }
          }}
          disabled={isMoving}
          className="bg-violet-600 w-72"
        >
          <span>{props.mode === "d" ? "Delivery" : "Execute"}</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
