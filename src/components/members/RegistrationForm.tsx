
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle2, Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const memberSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  age: z.coerce.number().min(1, { message: "Idade deve ser maior que zero." }).optional(),
  birthDate: z.string({ required_error: "Data de nascimento é obrigatória." }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida. Use o formato AAAA-MM-DD ou o seletor de data." }),
  address: z.string().min(5, { message: "Endereço deve ter pelo menos 5 caracteres." }),
  timeAtChurch: z.string().min(2, { message: "Tempo de igreja é obrigatório." }),
  servesInMinistry: z.enum(['yes', 'no'], { required_error: "Selecione se serve em algum ministério." }),
  ministriesServed: z.string().optional(),
  role: z.string().min(2, { message: "Cargo é obrigatório." }),
  dataAiHint: z.string().optional(),
}).refine(data => {
  if (data.servesInMinistry === 'yes') {
    return data.ministriesServed && data.ministriesServed.trim().length >= 2;
  }
  return true;
}, {
  message: "Detalhes do ministério são obrigatórios se você serve em algum (mínimo 2 caracteres).",
  path: ['ministriesServed'],
});

type MemberFormData = z.infer<typeof memberSchema>;

export default function RegistrationForm() {
  const { addMember } = useMembers();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const { toast } = useToast();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      address: "",
      timeAtChurch: "",
      servesInMinistry: undefined, 
      ministriesServed: "",
      role: "",
      dataAiHint: "person portrait",
    }
  });
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, control } = form;

  const servesInMinistryValue = watch('servesInMinistry');

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
    const memberPayload = {
      ...data,
      servesInMinistry: data.servesInMinistry === 'yes',
      ministriesServed: data.servesInMinistry === 'yes' ? data.ministriesServed : undefined,
      birthDate: data.birthDate, 
      dataAiHint: data.name.split(' ')[0].toLowerCase() + " " + (data.age && data.age > 18 ? "adult" : "person"), 
    };

    addMember(
      memberPayload,
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
      photoInputRef.current.value = "";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline text-foreground">Cadastro de Novo Membro</CardTitle>
        <CardDescription className="text-foreground">Preencha os dados abaixo para adicionar um novo membro ao álbum.</CardDescription>
      </CardHeader>
      <Form {...form}>
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
                   <span className="text-white text-center p-2 text-sm">OPÇÃO DE ALINHAR FOTO</span>
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
                Clique na área da foto acima ou use uma das opções abaixo.
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
                <Input id="birthDate" type="date" {...register('birthDate')} />
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
                <Label htmlFor="role">Cargo/Função na Igreja</Label>
                <Input id="role" {...register('role')} placeholder="Ex: Membro, Líder de Célula, Voluntário" />
                {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
              </div>
            </div>

            <FormField
              control={control}
              name="servesInMinistry"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Serve em algum ministério?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">Sim</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">Não</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {servesInMinistryValue === 'yes' && (
              <div className="space-y-1">
                <Label htmlFor="ministriesServed">Qual ministerio voce serve?</Label>
                <Textarea id="ministriesServed" {...register('ministriesServed')} placeholder="Ex: Louvor, Infantil, Diaconia" />
                {errors.ministriesServed && <p className="text-sm text-destructive">{errors.ministriesServed.message}</p>}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar Membro'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
    
    
    
    
