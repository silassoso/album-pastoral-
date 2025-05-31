
"use client";
import { useState, type ChangeEvent, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMembers } from '@/hooks/useMembers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarIcon, UserCircle2, Camera, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";


const memberSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  age: z.coerce.number().min(1, { message: "Idade deve ser maior que zero." }).optional(),
  birthDate: z.date({ required_error: "Data de nascimento é obrigatória." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  timeAtChurch: z.string().min(2, { message: "Tempo de igreja é obrigatório." }),
  ministry: z.string().min(2, { message: "Ministério é obrigatório." }),
  role: z.string().min(2, { message: "Cargo é obrigatório." }),
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function RegistrationForm() {
  const { addMember } = useMembers();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue, watch, reset } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });
  
  const birthDateValue = watch('birthDate');

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectFile = () => {
    if (photoInputRef.current) {
      photoInputRef.current.removeAttribute('capture');
      photoInputRef.current.click();
    }
  };

  const handleTakePhoto = () => {
    if (photoInputRef.current) {
      photoInputRef.current.setAttribute('capture', 'user');
      photoInputRef.current.click();
    }
  };

  const onSubmit: SubmitHandler<MemberFormData> = (data) => {
    // Convert photoPreview (Data URL) to File object if needed, or use photoFile directly
    // For simplicity, we assume photoFile is what we need to upload/process
    addMember(
      { 
        ...data, 
        birthDate: format(data.birthDate, 'yyyy-MM-dd') 
      }, 
      photoFile || undefined
    );
    toast({
      title: "Membro Cadastrado!",
      description: `${data.name} foi adicionado(a) ao álbum.`,
      variant: "default",
    });
    reset();
    setPhotoPreview(null);
    setPhotoFile(null);
    if (photoInputRef.current) {
      photoInputRef.current.value = ""; // Clear the file input
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-primary">Cadastro de Novo Membro</CardTitle>
        <CardDescription>Preencha os dados abaixo para adicionar um novo membro ao álbum.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center">
            <Label htmlFor="photo" className="block mb-2 font-semibold">Foto do Membro</Label>
            <div className="w-40 h-40 mx-auto rounded-full border-2 border-dashed border-primary flex items-center justify-center bg-muted overflow-hidden relative group">
              {photoPreview ? (
                <Image src={photoPreview} alt="Prévia da foto" layout="fill" objectFit="cover" />
              ) : (
                <UserCircle2 className="w-24 h-24 text-muted-foreground" />
              )}
               <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" onClick={handleSelectFile}>
                 <Camera className="w-10 h-10 text-white" />
               </div>
            </div>
            <Input 
              id="photo" 
              ref={photoInputRef}
              type="file" 
              accept="image/*"
              onChange={handlePhotoChange} 
              className="hidden"
            />
            <div className="mt-2 flex flex-col sm:flex-row gap-2 justify-center">
              <Button type="button" variant="outline" onClick={handleSelectFile}>
                <Upload className="mr-2 h-4 w-4" />
                Selecionar do Dispositivo
              </Button>
              <Button type="button" variant="outline" onClick={handleTakePhoto}>
                <Camera className="mr-2 h-4 w-4" />
                Tirar Foto
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {photoPreview ? "Para trocar a foto, " : ""}
              Clique no ícone da câmera acima ou use uma das opções.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...register('name')} placeholder="Ex: João da Silva" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !birthDateValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDateValue ? format(birthDateValue, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDateValue}
                    onSelect={(date) => setValue('birthDate', date as Date, { shouldValidate: true })}
                    initialFocus
                    locale={ptBR}
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="age">Idade (Opcional)</Label>
            <Input id="age" type="number" {...register('age')} placeholder="Ex: 30" />
            {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Endereço</Label>
            <Textarea id="address" {...register('address')} placeholder="Ex: Rua Exemplo, 123, Bairro, Cidade - UF" />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="timeAtChurch">Tempo de Igreja</Label>
              <Input id="timeAtChurch" {...register('timeAtChurch')} placeholder="Ex: 5 anos / Desde 2010" />
              {errors.timeAtChurch && <p className="text-sm text-destructive">{errors.timeAtChurch.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="ministry">Ministério Principal</Label>
              <Input id="ministry" {...register('ministry')} placeholder="Ex: Louvor, Infantil, Diaconia" />
              {errors.ministry && <p className="text-sm text-destructive">{errors.ministry.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="role">Cargo/Função na Igreja</Label>
            <Input id="role" {...register('role')} placeholder="Ex: Membro, Líder de Célula, Voluntário" />
            {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Membro'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

