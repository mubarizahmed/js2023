import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.tsx";
import Rollcall from "./pages/Rollcall.tsx";
import Login from "./pages/Login.tsx";
import { supabase } from "./supabaseClient.ts";

function App() {
  const [session, setSession] = useState(null);

  // set dark theme on page load
  document.body.classList.add("dark");

  useEffect(() => {
    console.log("connecting");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log(session);
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
          <Navbar />
          <Rollcall key={session.user.id} session={session}/>
        </>
      )}
    </>
  );
}

export default App;
