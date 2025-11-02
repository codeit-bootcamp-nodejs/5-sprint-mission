import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../service/auth.service";
import cookieParser from "cookie-parser";

export default class AuthController {
  private authService;
  private authRouter = Router();

  constructor(authService: AuthService) {
    this.authService = authService;
    this.registerRoutes();
  }

  registerRoutes() {
    this.authRouter.post("/register", this.registerMiddleware);
    this.authRouter.post("/login",this.loginMiddleware);
  }

  registerMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, nickname, password } = req.body;

      if (!email || !nickname || !password) {
        return res
          .status(400)
          .json({ message: "Empty email, nickname or password" });
      }

      const newUser = await this.authService.register({
        email,
        nickname,
        password,
      });

      res.status(201).json({
        message: "Register Success",
        user: newUser,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exist")) {
        return res.status(409).json({ message: error.message });
      }
      next(error);
    }
  };

  loginMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try{
      const {email, password} = req.body;

      if(!email || !password){
        return res.status(400).json({message: "Empty email or password"});
      }

      const result = await this.authService.login({email, password});

      res.cookie('refreshToken', result.refreshToken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7* 24* 60 * 60 * 1000
      });

      res.status(200).json({
        message: 'Login Success',
        accessToken: result.accessToken,
        user: result.user
      });
    }
    catch(error){
      if(error instanceof Error && error.message.includes('Invalid')){
        return res.status(401).json({message: error.message});
      }
      next(error);
    }
  }
}

