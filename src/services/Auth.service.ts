import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthCredential, User } from "firebase/auth";
import { ToDoApp } from "../index"

export class AuthService {

    private provider = new GoogleAuthProvider();
    private auth = getAuth(ToDoApp.firebaseApp);
    public user?: User;
    private googleCredential?: OAuthCredential | null; 

    constructor () {
        this.auth.languageCode = 'pt-BR';
    }
    
    public async LoginWithGoogle(): Promise<void>{
        signInWithPopup(this.auth, this.provider)
            .then((result) => {
                this.googleCredential = GoogleAuthProvider.credentialFromResult(result);
                this.user = result.user;
            })
            .catch((error) => {
                console.error(error.code);
                console.error(error.message);
                console.error(error)
            });
    }
    
    public IsUserLogged(): boolean {
        return this.user ? true : false
    }
    
    public getLoggedUser (): User | undefined {
        return this.user;
    }
}


