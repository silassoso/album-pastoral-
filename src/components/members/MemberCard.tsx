
import type { Member } from '@/types';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-xl"
      onClick={onClick}
      aria-label={`Ver detalhes de ${member.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
        <Avatar className="w-24 h-24 border-2 border-primary shadow-md">
          <AvatarImage 
            src={member.photoUrl} 
            alt={`Foto de ${member.name}`} 
            data-ai-hint={member.dataAiHint || "person portrait"}
            className="object-cover"
          />
          <AvatarFallback>{member.name ? member.name.substring(0, 2).toUpperCase() : 'N/A'}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <CardTitle className="text-xl font-headline" title={member.name}>{member.name}</CardTitle>
          {member.ministry && <p className="text-sm text-muted-foreground">{member.ministry}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
