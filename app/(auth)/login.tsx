import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Alert } from "react-native";
import { auth } from "../../services/firebase";



export default function Login(){
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] =useState(false);

    const handleLogin = async()=>{
        if (!email || !password) {
            Alert.alert("Error", "please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, email, password );
            router.replace("/(dashboard)/home");
        } catch (error:any){
            Alert.alert("Login failed", error.message);
        }finally{
            setLoading(false);
        }
            
        };

        return(

        )
    }
