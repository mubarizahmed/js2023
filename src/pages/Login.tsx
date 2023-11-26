import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import amjLogo from "../assets/amj.svg";
import { supabase } from "../supabaseClient";


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({  email: email,
    password: password});

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-[100vh] flex justify-around items-center">
      <Card className="w-[350px]">
        <form className="form-widget" onSubmit={handleLogin}>
          <CardHeader>
            <img src={amjLogo} className="logo h-20 p-2" alt="React logo" />
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email and password below to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1">
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                id="password"
                type="password"
                placeholder="password"
                value={password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button disabled={loading}>
              {loading ? <span>Loading</span> : <span>Sign In</span>}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
