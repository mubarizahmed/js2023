import React from "react";
import { NavLink } from "react-router-dom";
import amjLogo from "../assets/amj.svg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MdDarkMode } from "react-icons/md";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AuthSession } from "@supabase/supabase-js";

const Navbar = ({ session }: { session: AuthSession }) => {
  return (
    <>
      <div className="navbar flex flex-row w-full justify-between items-center p-2 pl-4 pr-4">
        <div className="navbar-left">
          <NavLink to="/">
            <img src={amjLogo} className="logo h-10 p-2" alt="React logo" />
          </NavLink>
        </div>
        <div className="navbar-center flex flex-row gap-2">
          <NavLink to="/registration">
            {({ isActive }) => <Toggle pressed={isActive}>Registration</Toggle>}
          </NavLink>
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
          <Avatar>
            <AvatarFallback>{session.user.email?.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Navbar;
