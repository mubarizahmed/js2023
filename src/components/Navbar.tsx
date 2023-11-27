import React from "react";
import { Link } from "react-router-dom";
import amjLogo from "../assets/amj.svg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MdDarkMode } from "react-icons/md";

const Navbar = () => {
  return (
    <>
      <div className="navbar flex flex-row w-full justify-between items-center p-2 pl-4 pr-4">
        <div className="navbar-left">
          <Link to="/">
            <img src={amjLogo} className="logo h-10 p-2" alt="React logo" />
          </Link>
        </div>
        <div className="navbar-center flex flex-row gap-2">
          <Link to="/registration">
            <Button variant="ghost" size="sm">
              Registration
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm">
              Meal
            </Button>
          </Link>
        </div>
        <div className="navbar-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.body.classList.toggle("dark")}
          >
            <MdDarkMode />
          </Button>
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Navbar;
