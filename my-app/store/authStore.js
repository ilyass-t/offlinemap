import {create} from "zustand"
import asyncStorage from "@react-native-async-storage/async-storage";
export const useAuthStore=create((set) =>({
   user:null,
   token:null,
   isLoading:false,

   register:async()=>{
    set({isLoadin:true});
    try{
        const response=await fetch("http://localhost:3000/api/auth/register",{
            methode:"POST",
            headers:{
                "content-type": application/json,
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
        })
        const data=await response.json();
        if(!response.ok) throw new Error(data.message||"something went wrong");
        await asyncStorage.setItem("user",JSON.stringify(data.user));
        await asyncStorage.setItem("token",StackActions.token);
        set({token:data.token,user:data.user,isLoading:false});
        return{sucess:true};
    }
    catch(error){
        set({isLoading:false});
        return {sucess:false,error:error.message};
    }
   }
}));