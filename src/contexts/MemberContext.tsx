"use client";
import type { Member } from '@/types';
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'photoUrl'>, photoFile?: File) => void;
  isLoading: boolean;
}

export const MemberContext = createContext<MemberContextType | undefined>(undefined);

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'João da Silva',
    photoUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'man portrait',
    address: 'Rua Exemplo, 123, Vila Velha, VR',
    timeAtChurch: '5 anos',
    ministry: 'Louvor',
    role: 'Líder de Jovens',
    age: 30,
    birthDate: '1994-03-15',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    photoUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'woman portrait',
    address: 'Avenida Principal, 456, Centro, VR',
    timeAtChurch: 'Desde 2018',
    ministry: 'Infantil',
    role: 'Professora',
    age: 28,
    birthDate: '1996-07-22',
  },
  {
    id: '3',
    name: 'Carlos Pereira',
    photoUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'man smiling',
    address: 'Travessa Paz, 789, Retiro, VR',
    timeAtChurch: '10 anos',
    ministry: 'Diaconia',
    role: 'Diácono',
    age: 45,
    birthDate: '1979-01-10',
  },
];


export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from a persistent store or API in the future
    // For now, just use initial members
    setMembers(initialMembers);
    setIsLoading(false);
  }, []);

  const addMember = (memberData: Omit<Member, 'id' | 'photoUrl'>, photoFile?: File) => {
    const newId = (members.length + 1).toString() + Date.now().toString();
    let photoUrl = 'https://placehold.co/150x150.png';
    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
    }

    const newMember: Member = {
      ...memberData,
      id: newId,
      photoUrl: photoUrl,
      photoFile: photoFile,
    };
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  return (
    <MemberContext.Provider value={{ members, addMember, isLoading }}>
      {children}
    </MemberContext.Provider>
  );
};
