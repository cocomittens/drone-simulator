import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const OptionItem = ({ label, ...inputProps }) => {
  return (
    <div className="flex flex-col items-center">
      <Label>{label}</Label>
      {inputProps.type === "button" ? (
        <Button {...inputProps}>{inputProps.text}</Button>
      ) : (
        <Input className="my-2" {...inputProps} />
      )}
    </div>
  );
};
