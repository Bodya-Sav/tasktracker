import * as React from "react";

import { Button } from "./button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  useDrawer,
} from "./drawer";
import { EmblaCarousel } from "./ios-picker";

interface TimePickerDrawerProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  title: string;
}

function TimePickerDrawerInner({
  value,
  onChange,
  title,
}: Omit<TimePickerDrawerProps, "id">) {
  const { setOpen } = useDrawer();
  const [hour, setHour] = React.useState(0);
  const [minute, setMinute] = React.useState(0);

  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setHour(h);
      setMinute(m);
    }
  }, [value]);

  const handleDone = () => {
    const formattedHour = hour.toString().padStart(2, "0");
    const formattedMinute = minute.toString().padStart(2, "0");
    onChange(`${formattedHour}:${formattedMinute}`);
    setOpen(false);
  };

  return (
    <DrawerContent>
      <DrawerHeader className="text-center">
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <EmblaCarousel
        onHourSelect={setHour}
        onMinuteSelect={setMinute}
        initialHour={hour}
        initialMinute={minute}
      />
      <DrawerFooter>
        <Button
          onClick={handleDone}
          className="w-full text-md py-6 rounded-2xl bg-[#0084ff]"
          type="button">
          Готово
        </Button>
      </DrawerFooter>
    </DrawerContent>
  );
}

export function TimePickerDrawer({
  id,
  value,
  onChange,
  title,
}: TimePickerDrawerProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          id={id}
          variant="outline"
          type="button"
          className="w-full rounded-2xl py-6 bg-black/20">
          {value}
        </Button>
      </DrawerTrigger>
      <TimePickerDrawerInner value={value} onChange={onChange} title={title} />
    </Drawer>
  );
}

export default TimePickerDrawer;
