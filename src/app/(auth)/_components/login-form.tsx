"use client"

import { useForm } from "react-hook-form"
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form,FormControl,FormField,FormLabel,FormItem,FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardWrapper } from "./card-wrapper"
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
// import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";


export const LoginForm = () => {
    const searchParams = useSearchParams()
    // const callbackUrl = searchParams.get("callbackUrl")
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email is already in use with a different Provider!!" : "";
    // const [isTwoFactor,setTwoFactor] = useState(false)
    const [error,setError] = useState<string | undefined>("")
    const [success,setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues : {
            email: "", 
            password: "",
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        // startTransition(() => {
        //     login(values)
        //         .then((data) => {
        //             if (data?.error) {
        //                 form.reset()
        //                 setError(data.error)
        //             }

        //             // if (data?.success) {
        //             //     form.reset()
        //             //     setSuccess(data?.success)
        //             // }

        //             // if (data?.twoFactor) {
        //             //     setTwoFactor(true)
        //             // }
        //         })
        //         .catch(() => setError("Something Went Wrong"))
        // }) 
    }

    return (
       <CardWrapper 
        headerLabel="Good to See You Again!" 
        backButtonLabel="Don't you have an Account?" 
        backButtonHref="/sign-up" 
        showSocial
      >
            <Form {...form}>
                <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        {/* {isTwoFactor && (
                             <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Two Factor Code</FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                   />
                                 </FormControl>
                                 <FormMessage />
                               </FormItem>
                             )}
                           />
                        )} */}


                        {/* {!isTwoFactor && ( */}
                        <>
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-bold">Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isPending}
                                      placeholder="john.doe@example.com"
                                      type="email"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-bold">Password</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={isPending}
                                      placeholder="******"
                                      type="password"
                                    />
                                  </FormControl>
                                  <Button
                                    size="sm"
                                    variant="link"
                                    asChild
                                    className="px-0 font-normal"
                                  >
                                    <Link href="/reset">
                                      Forgot password?
                                    </Link>
                                  </Button>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </>

                    </div>
                        <FormError message={error || urlError} />
                        <FormSuccess message={success} />
                        {/* <FormSuccess message="Login Successful!" /> */}
                        <Button
                          disabled={isPending}
                          type="submit"
                          className="w-full text-white"
                        >
                          Login
                          {/* {isTwoFactor ? "Confirm" : "Login"} */}
                        </Button>
                </form>
            </Form>
       </CardWrapper>
    )
}