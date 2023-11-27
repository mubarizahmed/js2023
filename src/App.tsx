import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.tsx";
import Rollcall from "./pages/Rollcall.tsx";
import Login from "./pages/Login.tsx";
import Registration from "./pages/Registration.tsx";
import { supabase } from "./supabaseClient.ts";
import { AuthSession } from "@supabase/supabase-js";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [session, setSession] = useState<AuthSession>(null);
  const [admin, setAdmin] = useState(false);

  // set dark theme on page load
  document.body.classList.add("dark");

  useEffect(() => {
    console.log("connecting");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session);

      supabase.from("users").select("*").then(( {data, error} ) => {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          setAdmin(data[0].admin)
        }
      })

      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      {!session ? (
        <Login />
      ) : (
        <>
          <Navbar session={session} admin={admin} />
          <Routes>
            <Route path="/" element={<Rollcall />} />
            {admin ? <Route path="/registration" element={<Registration/>} /> : ""}
          </Routes>
        </>
      )}
      <Toaster />
    </>
  );
}

export default App;
