
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
import { UserCircle2, Camera, Upload, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const memberSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  age: z.coerce.number().min(0, { message: "Idade não pode ser negativa." }).optional(),
  birthDate: z.string({ required_error: "Data de nascimento é obrigatória." }).regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida. Use o formato AAAA-MM-DD ou o seletor de data." }),
  
  cep: z.string().regex(/^\d{5}-?\d{3}$/, { message: "CEP inválido. Use XXXXX-XXX ou XXXXXXXX." }).optional().or(z.literal("")),
  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  uf: z.string().optional(),

  timeAtChurch: z.string().min(2, { message: "Tempo de igreja é obrigatório." }),
  servesInMinistry: z.enum(['yes', 'no'], { required_error: "Selecione se serve em algum ministério." }),
  ministriesServed: z.string().optional(),
  role: z.string().min(2, { message: "Cargo é obrigatório." }),
  isBaptized: z.enum(['yes', 'no'], { required_error: "Selecione se é batizado." }),
}).refine(data => {
  if (data.servesInMinistry === 'yes') {
    return data.ministriesServed && data.ministriesServed.trim().length >= 2;
  }
  return true;
}, {
  message: "Detalhes do ministério são obrigatórios se você serve em algum (mínimo 2 caracteres).",
  path: ['ministriesServed'],
}).refine(data => {
  // Se o CEP for informado, os campos básicos de endereço também deveriam ser (simulação)
  if (data.cep && (!data.logradouro || !data.bairro || !data.cidade || !data.uf)) {
    // Esta validação pode ser mais sofisticada dependendo da API de CEP
    // return false; // Desabilitado para permitir o cadastro sem CEP completo por enquanto
  }
  return true;
}, {
  // message: "Logradouro, bairro, cidade e UF são obrigatórios se o CEP for informado.",
  // path: ['logradouro'] // Poderia ser um path genérico ou específico
});

type MemberFormData = z.infer<typeof memberSchema>;

function calculateAge(birthDateString: string): number | undefined {
  if (!birthDateString || !/^\d{4}-\d{2}-\d{2}$/.test(birthDateString)) {
    return undefined;
  }
  const [year, month, day] = birthDateString.split('-').map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const birthDate = new Date(year, month - 1, day);
  if (isNaN(birthDate.getTime()) || birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) return undefined;
  const today = new Date();
  if (birthDate > today) return 0;
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age < 0 ? 0 : age;
}

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
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      timeAtChurch: "",
      servesInMinistry: undefined,
      ministriesServed: "",
      role: "",
      isBaptized: undefined,
    }
  });
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch, control, setValue, trigger } = form;

  const servesInMinistryValue = watch('servesInMinistry');
  const birthDateValue = watch('birthDate');
  const cepValue = watch('cep');

  useEffect(() => {
    if (birthDateValue) {
      const age = calculateAge(birthDateValue);
      setValue('age', age !== undefined ? age : undefined, { shouldValidate: true });
    } else {
      setValue('age', undefined, { shouldValidate: true });
    }
  }, [birthDateValue, setValue]);

  // Simulação de busca de CEP
  useEffect(() => {
    const fetchAddress = async (cep: string) => {
      // Remove caracteres não numéricos do CEP
      const numericCep = cep.replace(/\D/g, '');
      if (numericCep.length === 8) {
        // AQUI VOCÊ FARIA A CHAMADA REAL PARA UMA API DE CEP
        // Exemplo com API fictícia (substitua pela sua implementação real):
        // try {
        //   const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
        //   if (!response.ok) throw new Error('CEP não encontrado');
        //   const data = await response.json();
        //   if (data.erro) throw new Error('CEP não encontrado');
        //   setValue('logradouro', data.logradouro || '', { shouldValidate: true });
        //   setValue('bairro', data.bairro || '', { shouldValidate: true });
        //   setValue('cidade', data.localidade || '', { shouldValidate: true });
        //   setValue('uf', data.uf || '', { shouldValidate: true });
        //   trigger(['logradouro', 'bairro', 'cidade', 'uf']); // Valida os campos preenchidos
        // } catch (error) {
        //   console.error("Erro ao buscar CEP:", error);
        //   toast({ title: "Erro ao buscar CEP", description: (error as Error).message, variant: "destructive" });
        // }

        // Simulação:
        console.log(`Buscando endereço para o CEP: ${numericCep}`);
        toast({
            title: "Simulação de Busca de CEP",
            description: `Em um app real, o endereço para ${numericCep} seria buscado aqui.`,
        });
        // Exemplo de preenchimento simulado:
        if (numericCep === "12345678") {
            setValue('logradouro', "Rua Simulada", { shouldValidate: true });
            setValue('bairro', "Bairro Fictício", { shouldValidate: true });
            setValue('cidade', "Cidade Exemplo", { shouldValidate: true });
            setValue('uf', "EX", { shouldValidate: true });
        } else {
            // Limpa os campos se o CEP não for o simulado ou se a busca falhar
            setValue('logradouro', "", { shouldValidate: true });
            setValue('bairro', "", { shouldValidate: true });
            setValue('cidade', "", { shouldValidate: true });
            setValue('uf', "", { shouldValidate: true });
        }
        trigger(['logradouro', 'bairro', 'cidade', 'uf']);
      } else {
        // Limpa os campos se o CEP não tiver 8 dígitos
        setValue('logradouro', "", { shouldValidate: true });
        setValue('bairro', "", { shouldValidate: true });
        setValue('cidade', "", { shouldValidate: true });
        setValue('uf', "", { shouldValidate: true });
      }
    };

    if (cepValue) {
      fetchAddress(cepValue);
    }
  }, [cepValue, setValue, toast, trigger]);


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
    const fullAddress = [
      data.logradouro,
      data.numero,
      data.complemento,
      data.bairro,
      data.cidade,
      data.uf,
      data.cep,
    ].filter(Boolean).join(', ');

    const memberPayload = {
      ...data,
      address: fullAddress || "Endereço não informado", // Fallback para o campo address
      servesInMinistry: data.servesInMinistry === 'yes',
      ministriesServed: data.servesInMinistry === 'yes' ? data.ministriesServed : undefined,
      isBaptized: data.isBaptized === 'yes',
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
              <Label htmlFor="age">Idade</Label>
              <Input id="age" type="number" {...register('age')} placeholder="Calculada automaticamente" readOnly className="bg-muted/50 cursor-default" />
              {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
            </div>

            <Card className="p-4 bg-card/50">
              <CardHeader className="p-2 mb-2">
                 <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl font-headline text-foreground">Endereço</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="space-y-4 p-2">
                <div className="space-y-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" {...register('cep')} placeholder="Digite o CEP (somente números)" maxLength={9} />
                  {errors.cep && <p className="text-sm text-destructive">{errors.cep.message}</p>}
                  <FormDescription className="text-xs">Ao digitar 8 números, o endereço será buscado (simulação).</FormDescription>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="logradouro">Logradouro</Label>
                    <Input id="logradouro" {...register('logradouro')} placeholder="Ex: Rua Exemplo" />
                    {errors.logradouro && <p className="text-sm text-destructive">{errors.logradouro.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="numero">Número</Label>
                    <Input id="numero" {...register('numero')} placeholder="Ex: 123" />
                    {errors.numero && <p className="text-sm text-destructive">{errors.numero.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input id="complemento" {...register('complemento')} placeholder="Ex: Apto 101, Bloco B" />
                  {errors.complemento && <p className="text-sm text-destructive">{errors.complemento.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="bairro">Bairro</Label>
                        <Input id="bairro" {...register('bairro')} placeholder="Ex: Centro" />
                        {errors.bairro && <p className="text-sm text-destructive">{errors.bairro.message}</p>}
                    </div>
                    <div className="space-y-1 md:col-span-1">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" {...register('cidade')} placeholder="Ex: Volta Redonda" />
                        {errors.cidade && <p className="text-sm text-destructive">{errors.cidade.message}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="uf">UF</Label>
                        <Input id="uf" {...register('uf')} placeholder="Ex: RJ" maxLength={2} />
                        {errors.uf && <p className="text-sm text-destructive">{errors.uf.message}</p>}
                    </div>
                </div>
              </CardContent>
            </Card>
            
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
              name="isBaptized"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Batizado(a)?</FormLabel>
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
