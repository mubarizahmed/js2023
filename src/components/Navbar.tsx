import React from 'react';
import reactLogo from '../assets/react.svg'
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { MdDarkMode } from "react-icons/md";


const Navbar = () => {
  return (
    <>
    <div className="navbar flex flex-row w-full justify-between items-center p-2 pl-4 pr-4">
      <div className="navbar-left">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo h-10 p-2" alt="React logo" />
        </a>
      </div>
      <div className="navbar-center flex flex-row gap-2">
        <Button variant="ghost" size="sm">Registration</Button>
        <Button variant="ghost" size="sm">Meal</Button>
      </div>
      <div className="navbar-right">
      <Button variant="ghost" size="icon" onClick={() => document.body.classList.toggle('dark')}>
        <MdDarkMode />
      </Button>
      </div>
    </div>
    <Separator />
    </>
  )
}

export default Navbar