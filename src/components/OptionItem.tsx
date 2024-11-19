import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <div className="flex flex-col items-center">
      <Label>{label}</Label>
      {inputProps.type !== "label" &&
        (inputProps.type === "button" ? (
          <Button className="my-4" {...inputProps}>
            {inputProps.text}
          </Button>
        ) : (
          <Input {...inputProps} />
        ))}
    </div>
  );
};
