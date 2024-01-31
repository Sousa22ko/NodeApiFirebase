import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";

import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

import firebaseConfig from "./firebaseConfig";
import { AuthService } from "./services/Auth.service";


export class ToDoApp {
    
    public static firebaseApp = initializeApp(firebaseConfig);
    public static defaultStorage = getStorage(this.firebaseApp);
    public static defaultAnalytics = getAnalytics(this.firebaseApp);
    
    private app;
    private port;

    constructor(private authService: AuthService) {
        this.app = express();
        this.port = 3000;
        this.app.use(bodyParser.json());

        this.setupMidleware();
        this.setupRoutes();
    }

    start(): void {
        this.app.listen(this.port, () => {
            console.log(`Servidor rodando em http://${firebaseConfig.projectId}.firebaseio.com:${this.port}`)
        });
    }

    verifyLogin(req: Request, resp: Response, next: NextFunction): void{
        //autentication
        if(!this.authService.IsUserLogged()) {
            console.log("user not logged")
            this.authService.LoginWithGoogle();
        }
    }

    setupMidleware(): void {
        //setting up the verification of login globaly
        this.app.use(this.verifyLogin);
    }

    setupRoutes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Welcome to my firebase Node API with Typescript!');
        });
    }

}

const authService = new AuthService();
const todoApi = new ToDoApp(authService);
todoApi.start();

