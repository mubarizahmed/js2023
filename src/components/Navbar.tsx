import React from "react";
import { NavLink } from "react-router-dom";
import amjLogo from "../assets/amj.svg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MdDarkMode } from "react-icons/md";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AuthSession } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/supabaseClient";

const Navbar = ({ session, admin }: { session: AuthSession; admin: boolean }) => {


  return (
    <>
      <div className="navbar flex flex-row w-full justify-between items-center p-2 pl-4 pr-4">
        <div className="navbar-left">
          <NavLink to="/">
            <img src={amjLogo} className="logo h-10 p-2" alt="React logo" />
          </NavLink>
        </div>
        <div className="navbar-center flex flex-row gap-2">
{ admin ?         <NavLink to="/registration">
            {({ isActive }) => <Toggle pressed={isActive}>Registration</Toggle>}
          </NavLink> : ""}
          <NavLink to="/">
            {({ isActive }) => <Toggle pressed={isActive}>Meals</Toggle>}
          </NavLink>
        </div>
        <div className="navbar-right flex flex-row gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.body.classList.toggle("dark")}
          >
            <MdDarkMode />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <button>
                <Avatar>
                  <AvatarFallback>
                    {session.user.email?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Sign Out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to sign out? You will need to re-enter your credentials to sign in.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" onClick={()=>{
                  supabase.auth.signOut({scope: "global",}).then(() => {
                    window.location.reload();
                  });
                }}>Sign Out</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Navbar;
