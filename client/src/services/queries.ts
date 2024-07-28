import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "./api";
import { SignUpFormData } from "../Types/validationSchema";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function  useSignUp(){
  const queryClient = useQueryClient();
  const navigate = useNavigate();
    return useMutation({
        mutationFn: (data:SignUpFormData)=>createUser(data),
        
        onMutate: () => {
          console.log("onMutate");
        },
        onSuccess: (response) => {
          console.log("onSuccess");
          console.log(response.data);
          navigate("/");
          

          
          //Notify("success", response?.data?.message);
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            console.error("onError", error?.response);
            //Notify("error", error?.response?.data?.message);
          }
        },
       
        onSettled: async (_, error) => {
          if (error) {
            console.error("onSettled error", error);
          } else {
            await queryClient.invalidateQueries({ queryKey: ["users"] });
          }
        },
      });

 
}