import * as bcrypt from "bcrypt";
import { User, Prisma } from "@prisma/client";
import AuthRepository from "../repository/auth.repository";
import { generateAccessToken, generateRefreshToken, TokenPayload } from "../utils/jwt.utils";
type RegisterParams = { email: string; nickname: string; password: string };
type LoginParams = {email: string; password: string};

export default class AuthService {
  private saltRounds = 10;
  private authRepo;

  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  async register({
    email,
    nickname,
    password,
  }: RegisterParams): Promise<Omit<User, "password">> {
    const existUserByEmail = await this.authRepo.findUserByEmail(email);
    if (existUserByEmail) {
      throw new Error("Email is already exist");
    }

    const existUserByNickname =
      await this.authRepo.findUserByNickname(nickname);
    if (existUserByNickname) {
      throw new Error("Nickname is already exist");
    }

    const hashPassword = await bcrypt.hash(password, this.saltRounds);

    const newUser = await this.authRepo.createUser({
      email,
      nickname,
      password: hashPassword,
    });

    return newUser;
  }
  async validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean>{
    return bcrypt.compare(inputPassword, hashedPassword);
  }
  async login({email, password}: LoginParams): Promise<{accessToken: string; refreshToken:string; user: Omit<User,'password'>}>{
    const user = await this.authRepo.findUserByEmail(email);
    if(!user){
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.validatePassword(password, user.password);
   
    if(!isPasswordValid){
      throw new Error('Invalid email or password');
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      nickname: user.nickname,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const {password:_, ...restData} = user;

    return {accessToken, refreshToken, user:restData};
  }
}
