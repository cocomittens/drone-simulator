import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <div>
      <Label>{label}</Label>
      {inputProps.type !== "label" &&
        (inputProps.type === "button" ? (
          <Button {...inputProps}>{inputProps.text}</Button>
        ) : (
          <Input {...inputProps} />
        ))}
    </div>
  );
};
