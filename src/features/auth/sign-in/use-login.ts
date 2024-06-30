import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
// import { signIn } from "@/lib/auth";
// import { User } from "@/db/schema";

// type ResponseType = InferResponseType<typeof client.api.login.$post>;
// type RequestType = InferRequestType<typeof client.api.login.$post>["json"];

interface LoginResponse {
  // Define properties expected in the login response data
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  // const mutation = useMutation<User, Error, User>({
    
  //   mutationFn: async (json): Promise<User> => {
  //     console.log("Login data:", json); 
  //     const resData = await signIn("credentials", json);

  //     return resData;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["users"] }); // refetch user data
  //     console.log("Login successful!");
  //     // Set a state variable for success message display (if needed)
  //   },
  //   onError: (error) => {
  //     const errorMessage = error.message || "Failed to log in!";
  //     console.error("Login Error:", errorMessage);
  //     // Set a state variable for error message display (if needed)
  //   },
  // });

  // return mutation;
};

export default useLogin;






// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { InferRequestType, InferResponseType } from "hono";
// import { client } from "@/lib/hono";
// // import { toast } from "sonner";

// type ResponseType = InferResponseType<typeof client.api.login.$post>;
// type RequestType = InferRequestType<typeof client.api.login.$post>["json"];

// export const useLogin = () => {
//   const queryClient = useQueryClient();
//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationFn: async (json): Promise<ResponseType> => {
//       console.log(json);
//       const res: Response = await client.api.login.$post({ json });
//       const data = await res.json();
//       console.log(data);
      
//       let message: string;
//       if (!res.ok) {
//         const responseBody: any = await res.json();
//         const message = responseBody.message;
//         throw new Error(message || "Failed to Log In!");
//       }

//       return await res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] }); // refetch user data
//       // toast.success("Login successful!");
//       console.log("Login successful!");
//     },
//     onError: (error) => {
//       // toast.error(error.message || "Failed to log in!"); 
//       console.log(error);
//     },
//   });

//   return mutation;
// };

// export default useLogin;
