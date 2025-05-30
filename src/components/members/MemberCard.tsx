import type { Member } from '@/types';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MemberCardProps {
  member: Member;
  onClick: () => void;
}

export default function MemberCard({ member, onClick }: MemberCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      onClick={onClick}
      aria-label={`Ver detalhes de ${member.name}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      <CardHeader className="p-0">
        <div className="aspect-square relative w-full">
          <Image
            src={member.photoUrl}
            alt={`Foto de ${member.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={member.dataAiHint || "person photo"}
            priority={false} // Set to true for above-the-fold images if applicable
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-headline truncate" title={member.name}>{member.name}</CardTitle>
      </CardContent>
    </Card>
  );
}
