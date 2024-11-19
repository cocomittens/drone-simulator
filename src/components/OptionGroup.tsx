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
      <CardContent>
        {inputData.map((data) =>
          Array.isArray(data) ? (
            <div className="flex">
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
