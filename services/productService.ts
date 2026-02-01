import {db} from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";


const productRef = collection(db,"products");

//create a product

export const addProduct = async(product: any) => {
    await addDoc(productRef,{
        ...product,
        createdAt:serverTimestamp(),
    });
};

//get products
export const getProducts = async() => {
    const snapshot = await getDocs(productRef);
    return snapshot.docs.map(doc => ({id: doc.id, ...doc.data(),

    }));
};

//update a product
export const updateProduct = async(id: string, product: any) => {
    const ref = doc(db, "products", id);
    await updateDoc(ref,product);
};

export const deleteProduct = async(id: string) => {
    const ref =doc(db,"products", id);
    await deleteDoc(ref);
};

