import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";
import { SignUpDto, LoginDto, TokenDto } from "../dto/auth.dto";

export class AuthController {
  private authService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const signUpDto: SignUpDto = req.body;
      const user = await this.authService.signUp(signUpDto);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loginDto: LoginDto = req.body;
      const { accessToken, refreshToken } =
        await this.authService.login(loginDto);
      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  token = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenDto: TokenDto = req.body;
      const { accessToken } = await this.authService.refreshToken(tokenDto);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };

  logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      await this.authService.logout(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
