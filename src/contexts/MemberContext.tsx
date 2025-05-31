
"use client";
import type { Member } from '@/types';
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface MemberContextType {
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'photoUrl'>, photoFile?: File) => void;
  deleteMember: (memberId: string) => void;
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
    servesInMinistry: true,
    ministriesServed: 'Louvor, Jovens',
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
    servesInMinistry: true,
    ministriesServed: 'Infantil',
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
    servesInMinistry: true,
    ministriesServed: 'Diaconia',
    role: 'Diácono',
    age: 45,
    birthDate: '1979-01-10',
  },
  {
    id: '4',
    name: 'Ana Costa',
    photoUrl: 'https://placehold.co/150x150.png',
    dataAiHint: 'woman smiling',
    address: 'Rua das Flores, 101, Aterrado, VR',
    timeAtChurch: '2 anos',
    servesInMinistry: false,
    role: 'Membro',
    age: 35,
    birthDate: '1989-11-05',
  },
];


export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simula o carregamento de dados, poderia ser uma chamada de API
    // Em um app real, você pode carregar do localStorage ou Firebase aqui
    setMembers(initialMembers);
    setIsLoading(false);
  }, []);

  const addMember = (memberData: Omit<Member, 'id' | 'photoUrl' | 'dataAiHint'>, photoFile?: File) => {
    const newId = (members.length + 1).toString() + Date.now().toString();
    let photoUrl = 'https://placehold.co/150x150.png';
    let dataAiHint = 'person placeholder'; 

    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
      dataAiHint = 'newly added person';
    }

    const newMember: Member = {
      ...memberData,
      id: newId,
      photoUrl: photoUrl,
      dataAiHint: dataAiHint, 
      photoFile: photoFile,
    };
    setMembers(prevMembers => [...prevMembers, newMember]);
  };

  const deleteMember = (memberId: string) => {
    setMembers(prevMembers => prevMembers.filter(member => member.id !== memberId));
    toast({
      title: "Membro Removido",
      description: "O membro foi removido do álbum.",
      variant: "default",
    });
  };

  return (
    <MemberContext.Provider value={{ members, addMember, deleteMember, isLoading }}>
      {children}
    </MemberContext.Provider>
  );
};
