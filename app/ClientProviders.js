"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./UserContext";
import UpContainer from "./UpContainer";

export default function ClientProviders({ children }) {
  return (
    <SessionProvider>
      <UserProvider>
        <UpContainer />
        {children}
      </UserProvider>
    </SessionProvider>
  );
}