import { AuthenticatedUserData } from "../../../domain/service/auth.service";
import { SignInDto } from "../../requests/user/user.req.schemas";

export interface IAuthService {
  signInUser(dto: SignInDto): Promise<AuthenticatedUserData>;
  signOutUser(id: string): Promise<void>;
  refreshTokens(refreshToken: string): Promise<AuthenticatedUserData>;
}
