"use client";
import React, { type ReactNode } from 'react';
import { MemberProvider } from './MemberContext';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <MemberProvider>
      {children}
    </MemberProvider>
  );
};
