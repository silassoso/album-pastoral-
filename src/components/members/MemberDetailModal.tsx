import type { Member } from '@/types';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberDetailModal({ member, isOpen, onClose }: MemberDetailModalProps) {
  if (!member) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-headline text-primary">{member.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Detalhes do Membro
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-md">
            <Image
              src={member.photoUrl}
              alt={`Foto de ${member.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={member.dataAiHint || "person large photo"}
            />
          </div>
          
          <div className="space-y-3 text-sm">
            <p><strong className="font-semibold text-primary-dark">Endereço:</strong> {member.address}</p>
            <p><strong className="font-semibold text-primary-dark">Tempo de Igreja:</strong> {member.timeAtChurch}</p>
            <p><strong className="font-semibold text-primary-dark">Ministério:</strong> {member.ministry}</p>
            <p><strong className="font-semibold text-primary-dark">Cargo:</strong> {member.role}</p>
            {member.age && <p><strong className="font-semibold text-primary-dark">Idade:</strong> {member.age} anos</p>}
            <p><strong className="font-semibold text-primary-dark">Data de Nascimento:</strong> {new Date(member.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <DialogClose asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
