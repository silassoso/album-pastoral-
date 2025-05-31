
"use client";
import type { Member } from '@/types';
import Image from 'next/image';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';


interface MemberDetailModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberDetailModal({ member, isOpen, onClose }: MemberDetailModalProps) {
  const { deleteMember } = useMembers();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!member) return null;

  const handleDelete = () => {
    deleteMember(member.id);
    setIsDeleteDialogOpen(false);
    onClose(); // Fecha o modal de detalhes também
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="mb-4 text-center sm:text-left">
          <DialogTitle className="text-2xl font-headline text-primary">{member.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Detalhes do Membro
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image Column */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden shadow-lg border-2 border-primary">
              <Image
                src={member.photoUrl}
                alt={`Foto de ${member.name}`}
                fill
                sizes="160px"
                className="object-cover"
                data-ai-hint={member.dataAiHint || "person profile"}
              />
            </div>
          </div>
          
          {/* Text Details Column */}
          <div className="space-y-3 text-sm text-center md:text-left">
            <p><strong className="font-semibold text-primary-dark">Endereço:</strong> {member.address}</p>
            <p><strong className="font-semibold text-primary-dark">Tempo de Igreja:</strong> {member.timeAtChurch}</p>
            <p>
              <strong className="font-semibold text-primary-dark">Batizado(a):</strong> {member.isBaptized ? 'Sim' : 'Não'}
            </p>
            <p>
              <strong className="font-semibold text-primary-dark">Serve em Ministério:</strong> {member.servesInMinistry ? 'Sim' : 'Não'}
            </p>
            {member.servesInMinistry && member.ministriesServed && (
              <p><strong className="font-semibold text-primary-dark">Ministérios:</strong> {member.ministriesServed}</p>
            )}
            <p><strong className="font-semibold text-primary-dark">Cargo:</strong> {member.role}</p>
            {member.age !== undefined && member.age !== null && <p><strong className="font-semibold text-primary-dark">Idade:</strong> {member.age} anos</p>}
            <p><strong className="font-semibold text-primary-dark">Data de Nascimento:</strong> {new Date(member.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <DialogFooter className="mt-6 sm:justify-between flex-col-reverse sm:flex-row gap-2">
           <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Membro
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso removerá permanentemente os dados do membro do álbum.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Deletar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DialogClose asChild>
            <Button 
              variant="outline"
              aria-label="Fechar modal"
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>

        <DialogClose asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Fechar modal de detalhes"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
