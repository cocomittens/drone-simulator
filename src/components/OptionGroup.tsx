import { OptionItem } from "./OptionItem.tsx";
import "../index.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OptionGroup = (props) => {
  const { title, inputData } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-60 flex flex-col justify-between">
        {inputData.map((data) =>
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
      </CardContent>
    </Card>
  );
};
