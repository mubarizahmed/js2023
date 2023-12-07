import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.tsx";
import Rollcall from "./pages/Rollcall.tsx";
import Login from "./pages/Login.tsx";
import Registration from "./pages/Registration.tsx";
import NoPage from "./pages/NoPage.tsx";
import { supabase } from "./supabaseClient.ts";
import { AuthSession } from "@supabase/supabase-js";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [session, setSession] = useState<AuthSession>(null);
  const [loaded, setLoaded] = useState(false);
  const [admin, setAdmin] = useState(false);

  // set dark theme on page load
  document.body.classList.add("dark");

  useEffect(() => {
    console.log("connecting");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session);

      getUser();

      setSession(session);
    });
  }, []);

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    getUser();
  });

  const getUser = () => {
    supabase.from("users").select("*").then(( {data, error} ) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setAdmin(data[0].admin)
      }
    })

    setLoaded(true);
  };

  return (
    <>
      {!session ? (
        <Login />
      ) : (
        <>
          <Navbar session={session} admin={admin} />
          <Routes>
            <Route path="/" element={<Rollcall />} />
            {admin ? <Route path="/registration" element={<Registration/>} /> : loaded ? "" : <Route path="/registration" />}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </>
      )}
      <Toaster />
    </>
  );
}

export default App;
