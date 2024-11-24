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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import useSound from "use-sound";
import beep from "../assets/beep.mp3";
import doublebeep from "../assets/doublebeep.mp3";

const dateToSupabaseString = (date: Date) => {
  return (
    date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
  );
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);

  // Alternative: Using date-fns
  // return format(date, 'MMMM dd, yyyy hh:mm:ss a');
}

const Security = () => {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(0);
  const [registration, setRegistration] = useState(null);

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
      message: "Successfully retrieved registration data.",
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
    torch: { on, off, isAvailable, isOn },
  } = useZxing({
    onDecodeResult(res) {
      if (res.getText() == result) return;
      setResult(res.getText());
      const regex = /^JS-\d{4}$/;

      if (regex.test(res.getText())) {
        setStatus(2);
        getRegistration(parseInt(res.getText().slice(3)));
      } else {
        setStatus(3);
      }
    },
  });

  const getRegistration = async (id: number) => {
    // console.log(meal, dateToSupabaseString(date), date.toISOString().slice(0,10), date);
    const { data, error } = await supabase
      .from("attendees")
      .select("*")
      .eq("id", id);

    if (error || data.length == 0) {
      playDoubleBeep();
      // console.log(data);
      // console.log(error);
      if (data.length == 0 ) {
        setStatus(3);
      } else if (error.code == "23503") {
        setStatus(4);
      } else {
        setStatus(4);
      }
    } else {
      playBeep();
      setStatus(2);
      // console.log(data);
      setRegistration(data[0]);
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-4 p-8 items-center">
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
        ) : (
          ""
        )}
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
                getRegistration(parseInt(event.target[0].value));
                setResult("JS-" + event.target[0].value.padStart(4, "0"));
                setDialogOpen(false);
                event.preventDefault();
              }}
            >
              <DialogHeader>
                <DialogTitle>Manual ID Entry</DialogTitle>
                <DialogDescription>
                  Enter the JALSA ID manually and click submit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ID
                  </Label>
                  <Input
                    type="number"
                    id="id"
                    defaultValue="0001"
                    onChange={(e) => {
                      // console.log(e);
                    }}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
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
      {registration ? (
        <div className="w-full">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Info
              </span>
            </div>
          </div>
          <div className="w-full flex flex-row flex-wrap items-center justify-around gap-4">
            <Card className="flex grow flex-col items-start">
              <CardHeader className="flex w-full flex-col items-center gap-2 justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {registration.name}
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {formatDate(registration.created_at)}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col w-full items-center gap-2">
                <div className="text-sm font-bold">{registration.org}</div>
                <div className="text-sm">
                  {registration.jamaat} - {registration.region}
                </div>
                <div className="text-sm">
                  Chair: {registration.chair ? "Yes" : "No"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <p>No Data</p>
      )}
    </div>
  );
};

export default Security;
