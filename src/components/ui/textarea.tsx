import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

interface AutoExpandingTextareaProps extends React.ComponentProps<"textarea"> {
  minHeight?: number;
  maxHeight?: number;
}

const AutoExpandingTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AutoExpandingTextareaProps
>(({ minHeight = 60, maxHeight, className, ...props }, ref) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(ref, () => textareaRef.current!);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      let newHeight = textareaRef.current.scrollHeight;

      if (maxHeight && newHeight > maxHeight) {
        newHeight = maxHeight;
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }

      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustHeight();
  }, [props.value, minHeight, maxHeight]);

  return (
    <Textarea
      ref={textareaRef}
      className={cn("min-h-[60px]", className)}
      style={{
        minHeight: minHeight,
        maxHeight: maxHeight,
        overflowY: "hidden",
      }}
      {...props}
    />
  );
});
AutoExpandingTextarea.displayName = "AutoExpandingTextarea";

export { AutoExpandingTextarea, Textarea };
export default Textarea;
