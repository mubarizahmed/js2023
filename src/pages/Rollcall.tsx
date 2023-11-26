import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdCalendarMonth } from "react-icons/md";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/supabaseClient";
import { AuthSession } from "@supabase/supabase-js";

const Rollcall = ({ session }: { session: AuthSession }) => {
  const [result, setResult] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = React.useState<Date>();
  const [status, setStatus] = useState(0);
  const statusData = [
    {
      icon: "🔍",
      title: "Scan the QR Code",
      message: "Ensure the correct meal type and date is entered.",
      color: "background",
    },
    {
      icon: "⌛",
      title: "Processing",
      message: "Please wait while we process your request.",
      color: "warning",
    },
    {
      icon: "✅",
      title: "Success",
      message: "Your registration was successful.",
      color: "success",
    },
    {
      icon: "❌",
      title: "Failed",
      message: "Incorrect code.",
      color: "error",
    },
    {
      icon: "❌",
      title: "Failed",
      message: "Error duplicate entry.",
      color: "error",
    },
    {
      icon: "❌",
      title: "Failed",
      message: "Unknown error in processing request.",
      color: "error",
    },
  ];

  const {
    ref,
    torch: { on, off },
  } = useZxing({
    onDecodeResult(res) {
      if (res.getText() == result) return;
      setResult(res.getText());
      const regex = /^JS23-\d{4}$/;

      if (regex.test(res.getText())) {
        setStatus(2);
        insertData(parseInt(res.getText().slice(5)));
      } else {
        setStatus(3);
      }
    },
  });

  const insertData = async (id: number) => {
    setStatus(1);
    const { error } = await supabase.from("meals").insert([
      {
        attendee_id: id,
        meal: meal,
        date: date.toISOString().slice(0, 10),
      },
    ]);
    if (error) {
      console.log(error);
      if (error.code == "23505") {
        setStatus(4);
      } else {
        setStatus(5);
      }
    } else {
      setStatus(2);
    }
  };

  useEffect(() => {
    console.log(session.user);
    if (meal == "") {
      // get the time of the day
      const now = new Date();
      const hour = now.getHours();
      if (hour < 12) {
        setMeal("Breakfast");
      } else if (hour < 18) {
        setMeal("Lunch");
      } else {
        setMeal("Dinner");
      }
      setDate(now);
    }
  });

  return (
    <div className="flex flex-col w-full h-full gap-4 p-8 items-center">
      <div className="flex flex-row w-full gap-2 justify-between">
        <ToggleGroup
          type="single"
          value={meal}
          onValueChange={(value) => {
            if (value) {
              setMeal(value);
              setStatus(0);
              setResult("");
            }
          }}
        >
          <ToggleGroupItem value="Breakfast">B</ToggleGroupItem>
          <ToggleGroupItem value="Lunch">L</ToggleGroupItem>
          <ToggleGroupItem value="Dinner">D</ToggleGroupItem>
        </ToggleGroup>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <MdCalendarMonth className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative w-fit h-fit">
        <video
          ref={ref}
          className="max-h-[70vh] w-fit rounded-xl border border-border overflow-hidden"
        />
        {/* </div> */}
        {/* absolutely postioned button on top of video */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4"
          onClick={() => (on ? off() : on())}
          // disabled={!isAvailable}
        >
          {on ? "🔦" : "🔅"}
        </Button>
      </div>

      <Alert className={"bg-" + statusData[status].color}>
        <div className="text-xl font-bold">
          {status == 0 ? statusData[status].icon : result}
        </div>

        <AlertTitle>{statusData[status].title}</AlertTitle>
        <AlertDescription>{statusData[status].message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default Rollcall;
