import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold font-headline">IGREJA VERBO DA VIDA VOLTA REDONDA</h1>
          <p className="text-sm sm:text-md font-headline">Álbum de Membros</p>
        </div>
        <nav className="flex gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80">
            <Link href="/">
              <Users className="mr-2 h-5 w-5" />
              Membros
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80">
            <Link href="/cadastro">
              <UserPlus className="mr-2 h-5 w-5" />
              Cadastrar Novo
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
