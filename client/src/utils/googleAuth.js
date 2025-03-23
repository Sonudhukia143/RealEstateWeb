import {GoogleAuthProvider,getAuth, signInWithPopup} from "firebase/auth";
import { app } from "../firebase/firebaseConfig";

export default async function googleAuth () {
    try{
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth,provider);
        if(!result) console.log("No result found");

        const userData = {
            username:result._tokenResponse.displayName,
            gmail:result._tokenResponse.email,
            img:result._tokenResponse.photoUrl,
            password:result._tokenResponse.email,
            confirmpassword:result._tokenResponse.email,
            token: result._tokenResponse.idToken,
        };
        
        return userData;
    }catch(error){
        console.log("could not sign in with google",error);
    }
}