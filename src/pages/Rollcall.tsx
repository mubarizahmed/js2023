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
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdRestaurant } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSound from 'use-sound';
import beep from "../assets/beep.mp3";
import doublebeep from "../assets/doublebeep.mp3";

const dateToSupabaseString = (date: Date) => {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

const Rollcall = () => {
  const [result, setResult] = useState("");
  const [meal, setMeal] = useState("");
  const [date, setDate] = React.useState<Date>();
  const [status, setStatus] = useState(0);
  const [served, setServed] = useState<{
    date: string;
    meal: string;
    men_count: number;
    total_attendees: number;
    women_count: number;
  } | null>(null);
  const [attendees, setAttendees] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [playBeep] = useSound(beep);
  const [playDoubleBeep] = useSound(doublebeep);
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
      message: "Attendee not registered.",
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
    torch: { on, off, isAvailable, isOn},
  } = useZxing({
    onDecodeResult(res) {
      if (res.getText() == result) return;
      setResult(res.getText());
      const regex = /^JS-\d{4}$/;

      if (regex.test(res.getText())) {
        setStatus(2);
        insertData(parseInt(res.getText().slice(3)));
      } else {
        playDoubleBeep();
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
        date: dateToSupabaseString(date),
      },
    ]);
    if (error) {
      playDoubleBeep();
      console.log(error);
      if (error.code == "23505") {
        setStatus(4);
      } else if (error.code == "23503") {
        setStatus(5);
      } else {
        setStatus(6);
      }
    } else {
      playBeep();
      setStatus(2);
      getServed();
    }
  };

  // const getServed = async () => {
  //   // console.log(meal, dateToSupabaseString(date), date.toISOString().slice(0,10), date);
  //   const { data, error } = await supabase
  //     .from("meals")
  //     .select("*")
  //     .eq("meal", meal)
  //     .eq("date", dateToSupabaseString(date));

  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log(data);
  //     setServed(data.length);
  //   }

  //   const {count: attendeeData, error: attendeeError} = await supabase.from("attendees").select("*", {count: "exact", head: false});

  //   if (attendeeError) {
  //     console.log(attendeeError);
  //   } else {
  //     console.log(attendeeData);
  //     setAttendees(attendeeData);
  //   }
  // };

  async function getServed() {
    const { data, error } = await supabase
      .from("meals_summary")
      .select("*")
      .eq("meal", meal)
      .eq("date", dateToSupabaseString(date));

    if (error || data.length == 0) {
      console.log(error);
      setServed({men_count: 0, women_count: 0, total_attendees: 0, date: dateToSupabaseString(date), meal: meal});
    } else {
      console.log(data);
      setServed(data[0] || null);
    }
  }

  useEffect(() => {
    if (meal != "" && date != undefined) {
      getServed();
    }
  }, [meal, date]);

  useEffect(() => {
    // console.log(session.user);
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
          onClick={() => playDoubleBeep()}
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
              ISOWeek
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="relative w-fit h-fit">
        <video
          ref={ref}
          className="max-h-[70vh] w-fit rounded-xl border border-border overflow-hidden"
        />


        {isAvailable ? (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-16 right-4"
          onClick={() => (isOn ? off() : on())}
          // disabled={!isAvailable}
        >
          {isOn ? "🔦" : "🔅"}
        </Button>
        ) : ""}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-4 right-4"
            >
              #
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(event) => {
              // console.log(event);
              insertData(parseInt(event.target[0].value));
              setResult("JS-"+event.target[0].value.padStart(4, "0"));
              setDialogOpen(false);
              event.preventDefault();
            }}
          >
            <DialogHeader>
              <DialogTitle>Manual ID Entry</DialogTitle>
              <DialogDescription>
                Enter the JALSA ID manually and click submit. Ensure that the
                meal type and date are correctly selected.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  ID
                </Label>
                <Input type="number" id="id" defaultValue="0001" onChange={(e)=> {console.log(e)}} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" >Submit</Button>
            </DialogFooter>
          </form>
          </DialogContent>
        </Dialog>
      </div>

      <Alert className={"bg-" + statusData[status].color}>
        <div className="text-xl font-bold">
          {status == 0 ? statusData[status].icon : result}
        </div>

        <AlertTitle>{statusData[status].title}</AlertTitle>
        <AlertDescription>{statusData[status].message}</AlertDescription>
      </Alert>

      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Statistics
          </span>
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap items-center justify-around gap-4">
        <Card className="flex grow flex-col items-start">
          <CardHeader className="flex w-full flex-row items-center gap-2 justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Served</CardTitle>
            <MdRestaurant />
          </CardHeader>
          <CardContent className="flex flex-row w-full items-center justify-between gap-2">
            <div className="text-2xl font-bold">{served ? served.men_count + served.women_count: "0"}</div>
            <div className="text-2xl text-muted-foreground">{"/" + (served ? served.total_attendees : "0")}</div>
          </CardContent>
          <CardHeader className="flex w-full flex-row items-center gap-2 justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gents</CardTitle>
            <CardTitle className="text-sm font-medium">Ladies</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row w-full items-center justify-between gap-2">
            <div className="text-2xl font-bold">{served ? served.men_count : "0"}</div>
            <div className="text-2xl font-bold">{served ? served.women_count : "0"}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rollcall;
