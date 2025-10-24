import { Exception } from "../../common/const/exception.js";

export class AuthService {
  #repos;
  #managers;

  constructor(repos, managers) {
    this.#repos = repos;
    this.#managers = managers;
  }

  signInUser = async ({ email, password }) => {
    const user = await this.#repos.user.findUserByEmail(email);
    if (!user) {
      throw new Exception("USER_NOT_EXSIST");
    }
    const isPasswordMatch = await this.#managers.hash.verifyPassword(password, user.password);
    if (!isPasswordMatch) {
      throw new Exception("PASSWORD_MISMATCH");
    }
    const { accessToken, authenticatedUser } = await this.generateTokens(user.id);

    return { accessToken, authenticatedUser };
  }

  //다 만료 시에는 로그인 페이지로 이동하게 프론트엔트 코드를 구현하면 될 것 같다
  generateTokens = async (userId) => { 
    const { accessToken, refreshToken } = this.#managers.token.generate({
      userId
    });
    const authenticatedUser = await this.#repos.user.generate(userId, refreshToken);
    return { accessToken, authenticatedUser };
  }

  refreshTokens = async (refreshToken) => { // 엑세스 만료 시
    const decoded = this.#managers.token.verify(refreshToken);
    const foundUser = await this.#repos.user.findUserByRefreshToken(refreshToken);

    if (!foundUser) {
      throw new Exception("REFRESHTOKEN_NOT_EXSIST");
    }

    if (foundUser.id !== decoded.userId) {
      throw new Exception("REFRESHTOKEN_MISMATCH");
    }

    const { accessToken, refreshToken: updatedrefreshToken } =
      this.#managers.token.generate({
        userId: decoded.userId,
      }
      );

    const user = await this.#repos.user.generate(decoded.userId, updatedrefreshToken);

    return { accessToken, user };
  }
}