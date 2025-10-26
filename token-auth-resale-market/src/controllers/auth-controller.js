import { AuthService } from "../services/auth-service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthController {
  constructor() {
    this.authService = new AuthService(prisma);
  }

  signUp = async (req, res) => {
    const result = await this.authService.signUp(req.body);
    res.json(result);
  };

  login = async (req, res) => {
    const result = await this.authService.login(req.body);
    res.json(result);
  };

  refresh = async (req, res) => {
    const result = await this.authService.refresh(req.body.refreshToken);
    res.json(result);
  };

  logout = async (req, res) => {
    await this.authService.logout(req.user.userId);
    res.json(result);
  };
}
