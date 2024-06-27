"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form,FormControl,FormField,FormLabel,FormItem,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "./card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useState, useTransition } from "react";

import { createId } from "@paralleldrive/cuid2";
import { insertUser } from "@/features/auth/sign-up/api/insertUser";
import { useRouter } from "next/navigation";

const NewUserSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });


export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>("")
    const [success,setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const router = useRouter();

    const form = useForm<z.infer<typeof NewUserSchema>>({
      resolver: zodResolver(NewUserSchema),
      defaultValues: {
        email: "",
        password: "",
        name: "",
        id: "", // Pre-populate the id field (optional)
      },
    });
  
    const onSubmit =  (values: z.infer<typeof RegisterSchema>) => {
      setError("");
      setSuccess("");

      startTransition(async () => {
        values.id = createId();

        try {
          values.id = createId();

          const createdUser = await insertUser(values);

          if (createdUser) {
            setSuccess("User created successfully!");
            router.push("/login");
          } else {
            setError("User Creation Failed!");
            throw new Error("User creation failed");
          }
        } catch (err) {
          if (err instanceof Error && err.message === "Email is already used") {
            setError("Email is Already Used!");
          } else {
            setError("An error occurred during registration.");
          }
          console.error("Registration Error:", err);
        }
      });

    };

    return (
       <CardWrapper 
            headerLabel="Create an Account" 
            backButtonLabel="Already Have an Account?" 
            backButtonHref="/login" 
            showSocial
        >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">

                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold ">Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="Your Name..." />
                                    </FormControl>
                                    <FormMessage />
                        </FormItem>
                        )} 
                        /> 

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold">Email</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="Your Email..." type="email"/>
                                    </FormControl>
                                    <FormMessage />
                        </FormItem>
                        )} 
                        /> 

                        <FormField control={form.control} name="password" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="font-bold ">Password</FormLabel>
                                    <FormControl>
                                        <Input disabled={isPending} {...field} placeholder="Your Password..." type="password"/>
                                    </FormControl>
                                    <FormMessage />
                        </FormItem>
                        )} 
                        /> 
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type="submit" className="w-full  text-white"> 
                            Create An Account
                    </Button>
                </form>
            </Form>
       </CardWrapper>
    )
}