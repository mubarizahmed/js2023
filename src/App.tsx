import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar.tsx";
import Rollcall from "./pages/Rollcall.tsx";
import Security from "./pages/Security.tsx";
import Login from "./pages/Login.tsx";
import Registration from "./pages/Registration.tsx";
import NoPage from "./pages/NoPage.tsx";
import { supabase } from "./supabaseClient.ts";
import { AuthSession } from "@supabase/supabase-js";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import {useUser} from "./hooks/AuthContext.tsx";

function App() {
  // const [session, setSession] = useState<AuthSession>(null);
  // const [loaded, setLoaded] = useState(false);
  // const [admin, setAdmin] = useState(false);

  const { user, session, admin, food } = useUser();
  // set dark theme on page load
  document.body.classList.add("dark");

  // useEffect(() => {
  //   console.log("connecting");
  //   supabase.auth.getSession().then(({ data: { session: ses } }) => {
  //     console.log(ses);
  //     getUser();
  //     setSession(ses);
  //   });
  // }, []);

  // supabase.auth.onAuthStateChange((_event, session) => {
  //   setSession(session);
  //   if (_event == 'SIGNED_IN') {
  //     console.log('USER_UPDATED', session)
  //     getUser();
  //   }
  // });

  // const getUser = () => {
  //   supabase.from("users").select("*").then(( {data, error} ) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log(data);
  //       setAdmin(data[0].admin)
  //     }
  //   })
    
  //   setLoaded(true);
  // };


  useEffect(()=>{
    // getUser();
    console.log(session);
  }, []);



  return (
    <>
      {!session ? (
        <Login />
      ) : (
        <>
          <Navbar session={session} admin={admin} food={food}/>
          <Routes>
            <Route path="/" element={<Security />} />
            {admin ? <Route path="/registration" element={<Registration/>} /> :  <Route path="/registration" />}
            {admin ? <Route path="/meals" element={<Rollcall />} /> :  <Route path="/meals" />}
            <Route path="*" element={<NoPage />} />
          </Routes>
        </>
      )}
      <Toaster />
    </>
  );
}

export default App;
