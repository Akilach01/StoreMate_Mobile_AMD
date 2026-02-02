import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {storage} from "./firebase";
import { v4 as uuidv4 } from 'uuid';


export const uploadImageAsync = async (uri:string)=>{
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(storage, `products/${uuidv4()}.jpg`);
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);

};