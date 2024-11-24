import React, { createContext, useContext, useEffect, useState } from 'react';

import { Session, User } from '@supabase/supabase-js';

import { supabase } from '../supabaseClient';

export const AuthContext = createContext<{ user: User | null; session: Session | null; admin: boolean; food: boolean }>({
  user: null,
  session: null,
  admin: false,
  food: false,
});

export const AuthContextProvider = (props: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  const [food, setFood] = useState(false)

  const getUser = () => {
    supabase.from("users").select("*").then(( {data, error} ) => {
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        setAdmin(data[0].admin)
        setFood(data[0].food)
      }
    })
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (user !== session?.user) {
        getUser();
      }
      setUser(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setSession(session);
      if (user !== session?.user) {
        getUser();
      }
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    admin,
    food
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a AuthContextProvider.');
  }
  return context;
};