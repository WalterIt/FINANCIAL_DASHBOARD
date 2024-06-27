import Image from "next/image";
import { LoginForm } from '../_components/login-form'


const LoginPage = () => { 
  return (
    <>
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-4 pt-12">
          <h1 className="font-bold text-3xl text-[#2E2A47] ">Welcome Back!</h1>
          <p className="text-base text-[#545f6f] ">
            Log in or Create Account to get back to your Financial Dashboard!
          </p>
        </div>
        <div className="flex items-center justify-center mt-4">

          <LoginForm />
        </div>
      </div>

      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image src="/images/logo/logo.svg" alt="logo" width={100} height={100} />

      </div>
    </>
  )
}

export default LoginPage