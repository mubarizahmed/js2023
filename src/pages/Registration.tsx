import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/supabaseClient";
import { MdOutlinePeople } from "react-icons/md";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";


const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  jamaat: z.string().min(2, {
    message: "Jamaat must be at least 2 characters.",
  }),
  region: z.string().min(2, {
    message: "Region must be at least 2 characters.",
  }),
  org: z.string().min(2, {
    message: "Organization must be at least 2 characters.",
  }),
  id: z.coerce
    .number()
    .min(1, {
      message: "ID must be at least 1 character.",
    })
    .max(9999, {
      message: "ID must be at most 4 characters.",
    }),
});

const Registration = () => {
  const [men, setMen] = useState(true);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      jamaat: "",
      region: "",
      org: "",
      id: 0,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const { error } = await supabase.from("attendees").insert([
      {
        name: data.name,
        jamaat: data.jamaat,
        region: data.region,
        org: data.org,
        id: data.id,
      },
    ]);
    if (error) {
      if (error.code === "23505") {
        toast({
          title: "An error occured",
          description: (
            <pre className="mt-2 w-[340px] rounded-md whitespace-normal bg-zinc-950 p-4">
              <div className="text-white w-full">ID already exists</div>
            </pre>
          ),
          variant: "destructive",
        });
      } else {
        console.log(error);
        toast({
          title: "An error occured",
          description: (
            <pre className="mt-2 w-[340px] rounded-md whitespace-normal bg-zinc-950 p-4">
              <div className="text-white w-full">{error.message}</div>
            </pre>
          ),
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Attendee successfully registered",
        variant: "success",
      });
      form.reset();
    }
  }

  return (
    <div className="flex flex-col w-full h-full gap-4 p-8 items-center">
      <Card className="w-full flex flex-col items-start">
        <CardHeader className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-col items-start">
            <CardTitle>Registration</CardTitle>
            <CardDescription>Register new Jalsa attendee.</CardDescription>
          </div>
          <ToggleGroup
            type="single"
            value={men ? "m" : "f"}
            onValueChange={(val) => {
              setMen(val == "m");
            }}
          >
            <ToggleGroupItem value="m">M</ToggleGroupItem>
            <ToggleGroupItem value="f">F</ToggleGroupItem>
          </ToggleGroup>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-start">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between flex-wrap items-baseline gap-4 w-full">
                      <FormLabel className="w-14 text-left">Name</FormLabel>
                      <FormControl>
                        <Input
                          className=" grow min-w-[12rem] w-fit"
                          placeholder="Full Name"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jamaat"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between flex-wrap items-baseline gap-4 w-full">
                      <FormLabel className="w-14 text-left">Jamaat</FormLabel>
                      <FormControl>
                        <Input
                          className=" grow min-w-[12rem] w-fit"
                          placeholder="Jamaat"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between flex-wrap items-baseline gap-4 w-full">
                      <FormLabel className="w-14 text-left">Region</FormLabel>
                      <FormControl>
                        <Input
                          className=" grow min-w-[12rem] w-fit"
                          placeholder="Region"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="org"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between flex-wrap items-baseline gap-4 w-full">
                      <FormLabel className="w-14 text-left">Org</FormLabel>
                      <FormControl>
                        {men ? (
                          <ToggleGroup
                            variant="outline"
                            type="single"
                            className=""
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <ToggleGroupItem value="Ansar">
                              Ansar
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Khuddam">
                              Khuddam
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Atfal">
                              Atfal
                            </ToggleGroupItem>
                          </ToggleGroup>
                        ) : (
                          <ToggleGroup
                            variant="outline"
                            type="single"
                            className=""
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <ToggleGroupItem value="Lajna">
                              Lajna
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Nasirat">
                              Nasirat
                            </ToggleGroupItem>
                          </ToggleGroup>
                        )}
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between flex-wrap items-baseline gap-4 w-full">
                      <FormLabel className="w-14 text-left">ID</FormLabel>
                      <FormControl>
                        <Input
                          className=" grow min-w-[12rem] w-fit"
                          placeholder="ID"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

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
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <MdOutlinePeople />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,756</div>
          </CardContent>
        </Card>
        <Card className="flex grow flex-col items-start">
          <CardHeader className="flex w-full flex-row items-center gap-2 justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <MdOutlinePeople />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,756</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Registration;
