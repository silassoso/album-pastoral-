
"use client";
import { useState } from 'react';
import type { Member } from '@/types';
import { useMembers } from '@/hooks/useMembers';
import MemberCard from '@/components/members/MemberCard';
import MemberDetailModal from '@/components/members/MemberDetailModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function AlbumPage() {
  const { members, isLoading } = useMembers();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">Álbum de Membros</h2>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text"
              placeholder="Buscar membro..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/cadastro">
              <UserPlus className="mr-2 h-5 w-5" />
              Novo Membro
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="overflow-hidden rounded-xl">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <Skeleton className="w-32 h-32 rounded-full mb-4" /> 
                <div className="space-y-2 w-full flex flex-col items-center">
                  <Skeleton className="h-6 w-3/4" /> 
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} onClick={() => handleMemberClick(member)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground font-semibold">Nenhum membro encontrado.</p>
          {searchTerm && <p className="text-muted-foreground">Tente refinar sua busca ou <Button variant="link" onClick={() => setSearchTerm('')}>limpar a busca</Button>.</p>}
          {!searchTerm && <p className="text-muted-foreground">Cadastre novos membros para visualizá-los aqui.</p>}
        </div>
      )}

      <MemberDetailModal member={selectedMember} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
