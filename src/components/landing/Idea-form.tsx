"use client"
import React, { JSX, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Button } from '../ui/button'
import axios from 'axios'

type IdeaFormProps = {
  onSubmitIdea: (data: {
    title: string;
    description: string;
  }) => Promise<void> | void;
};


const formSchema = z.object({
  title: z
    .string()
    .min(3, " Title must be at least 3 characters.")
    .max(32, " Title must be at most 32 characters."),
  description: z
    .string()
    .optional()
    
    
})

export default function IdeaForm({ onSubmitIdea }: IdeaFormProps) {

const [isSubmitting, setIsSubmitting] = useState(false);

 const onsubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
  await onSubmitIdea(data);
  form.reset();
    setIsSubmitting(false);
};



  
 const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  return (
       <Card className="border-2 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
       <CardHeader className="border-b-2 mb-5 border-foreground bg-secondary/50">
                   <CardTitle className="text-2xl font-black uppercase tracking-tight">New Idea</CardTitle>

        <CardDescription>
          What's on your mind?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onsubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-1'>
                  <FieldLabel htmlFor="form-rhf-demo-title" className='text-sm font-bold uppercase'>
                   Title
                  </FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="THE NEXT BIG THING"
                    autoComplete="off"
                    className='font-bold border-2'
                    disabled={isSubmitting}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className='gap-1'>
                  <FieldLabel htmlFor="form-rhf-demo-description" className='text-sm font-bold uppercase'>
                    Description
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-description"
                      placeholder="Details"
                      rows={6}
                      className="min-h-24 resize-none font-medium border-2"
                      aria-invalid={fieldState.invalid}
                      disabled={isSubmitting}
                    />
                   
                  </InputGroup>
                  
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          
          <Button type="submit" form="form-rhf-demo" disabled={isSubmitting} className='border-2 border-foreground bg-foreground text-background hover:bg-foreground/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold text-base px-8 py-6 cursor-pointer'>
             {isSubmitting ? "SAVING…" : "ADD IDEA"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}


