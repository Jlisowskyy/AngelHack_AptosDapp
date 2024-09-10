'use client';
import {Label} from "@/components/ui/label";
import {FC} from "react";
import {cn} from "@/lib/utils";

const LabeledArea: FC<{
    className?: string;
    label: string;
    required?: boolean;
    tooltip: string;
    disabled?: boolean;
    value?: number | string;
    id: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({
          label,
          required,
          tooltip,
          disabled,
          value,
          onChange,
          id,
          className = "",
      }) => {
    return (
        <div className="flex flex-col item-center space-y-4">
            <Label htmlFor={id} tooltip={tooltip}>
                {label} {required ? "" : "(optional)"}
            </Label>
            <textarea
                disabled={disabled}
                id={id}
                value={value}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-primary file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                onChange={onChange}
            />
        </div>
    );
};

export default LabeledArea;