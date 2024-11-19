import "../index.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OptionGroup = (props) => {
  const { title, children } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-60 flex flex-col justify-between">
        {children}
      </CardContent>
    </Card>
  );
};
