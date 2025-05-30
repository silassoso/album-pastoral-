"use client";
import { useContext } from 'react';
import { MemberContext } from '@/contexts/MemberContext';

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
};
