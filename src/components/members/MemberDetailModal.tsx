
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
import { X, Trash2, MapPin, CalendarDays, Church, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';
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
    onClose(); 
  };

  const formatAddress = (m: Member) => {
    let parts = [];
    if (m.logradouro) parts.push(m.logradouro);
    if (m.numero) parts.push(m.numero);
    if (m.complemento) parts.push(m.complemento);
    
    let line1 = parts.join(', ');
    parts = [];
    if (m.bairro) parts.push(m.bairro);
    if (m.cidade) parts.push(m.cidade);
    if (m.uf) parts.push(m.uf.toUpperCase());
    let line2 = parts.join(' - ');
    if (line2 && m.cidade && m.uf) line2 = `${m.bairro} - ${m.cidade}/${m.uf.toUpperCase()}`;


    let fullAddress = "";
    if (line1) fullAddress += line1;
    if (line2) fullAddress += (fullAddress ? `\n${line2}` : line2);
    if (m.cep) fullAddress += (fullAddress ? `\nCEP: ${m.cep}` : `CEP: ${m.cep}`);
    
    return fullAddress || m.address || "Endereço não informado";
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] p-6 bg-card text-card-foreground rounded-lg shadow-xl">
        <DialogHeader className="mb-4 text-center sm:text-left">
          <DialogTitle className="text-2xl font-headline text-card-foreground">{member.name}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Detalhes do Membro
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
          
          <div className="space-y-3 text-sm text-center md:text-left">
            <p className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0"/> 
              <span><strong className="font-semibold text-card-foreground">Endereço:</strong><br/>{formatAddress(member).split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</span>
            </p>
            <p className="flex items-center gap-2"><Church className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Tempo de Igreja:</strong> {member.timeAtChurch}</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Batizado(a):</strong> {member.isBaptized ? 'Sim' : 'Não'}</p>
            <p className="flex items-center gap-2"><UserCheck className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Serve em Ministério:</strong> {member.servesInMinistry ? 'Sim' : 'Não'}</p>
            {member.servesInMinistry && member.ministriesServed && (
              <p className="flex items-start gap-2"><Briefcase className="h-4 w-4 mt-0.5 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Ministérios:</strong> {member.ministriesServed}</p>
            )}
            <p className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Cargo:</strong> {member.role}</p>
            {member.age !== undefined && member.age !== null && <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Idade:</strong> {member.age} anos</p>}
            <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent shrink-0"/><strong className="font-semibold text-card-foreground">Data de Nascimento:</strong> {new Date(member.birthDate + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
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
