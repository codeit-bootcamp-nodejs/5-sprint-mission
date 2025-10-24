import { SignInUserReqValidator } from "./req.validator/user/signin.user.req.validator.js";
import { SignUpUserReqValidator } from "./req.validator/user/signUp.user.req.validator.js";
import { UpdatePasswordReqValidator } from "./req.validator/user/update.password.req.validator.js";
import { updateUserReqValidator } from "./req.validator/user/update.user.req.validator.js";
import { UserIdReqValidator } from "./req.validator/user/userId.req.validator.js";
import { DeleteUserResDto } from "./res.dto/user/delete.user.res.dto.js";
import { RefreshTokensResDto } from "./res.dto/user/refresh.tokens.res.dto.js";
import { SignInResDto } from "./res.dto/user/signIn.res.dto.js";
import { SignOutResDto } from "./res.dto/user/signout.res.dto.js";
import { UserProductsResDto } from "./res.dto/user/user.products.res.dto.js";
import { UserResDto } from "./res.dto/user/user.Res.Dto.js";

export class UserController {
  #services
  
  constructor(services) {
    this.#services = services;
  }

  signInUserController = async (req, res, next) =>{
    const userReqDto = new SignInUserReqValidator({
      body: req.body,
    }).validate();

    const {accessToken, authenticatedUser} = await this.#services.auth.signInUser(userReqDto);
    const resDto = new SignInResDto(accessToken, authenticatedUser);
    return res.json(resDto);
  }

  signUpUserController = async (req, res, next) =>{
    const userReqDto = new SignUpUserReqValidator({
      body: req.body,
    }).validate();

    const user = await this.#services.user.signUpUser(userReqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  }

  signOutUserController = async (req, res, next) =>{
    const userReqDto = new UserIdReqValidator({
      userId: req.userId,
    }).validate();

    await this.#services.auth.signOutUser(userReqDto);
    const resDto = new SignOutResDto();
    return res.json(resDto);
  }

  getUserController = async (req, res, next) =>{
    const userReqDto = new UserIdReqValidator({
      userId: req.userId,
    }).validate();
    
    const user = await this.#services.user.getUser(userReqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  }

  getUserProductsController = async (req, res, next) =>{
    const userReqDto = new UserIdReqValidator({
      userId: req.userId,
    }).validate();

    const {user, products} = await this.#services.user.getUserProducts(userReqDto);
    const resDto = new UserProductsResDto({user, products});
    return res.json(resDto);
  }

  updateUserController = async (req, res, next) =>{
    const userReqDto = new updateUserReqValidator({
      userId: req.userId,
      body: req.body,
    }).validate();

    const user = await this.#services.user.updateUser(userReqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  }

  updateUserPasswordController = async (req, res, next) =>{
    const UserPasswordReqDto = new UpdatePasswordReqValidator({
      userId: req.userId,
      body: req.body,
    }).validate();

    const user = await this.#services.user.updatePasswordUser(UserPasswordReqDto);
    const resDto = new UserResDto(user);
    return res.json(resDto);
  }

  deleteUserController = async (req, res, next) =>{
    const userReqDto = new UserIdReqValidator({
      userId: req.userId,
    }).validate();

    const user = await this.#services.user.deleteUser(userReqDto);
    const resDto = new DeleteUserResDto(user);
    return res.json(resDto);
  }

  refreshTokensController = async (req, res, next) => {
    const { accessToken, user } = await this.#services.auth.refreshTokens(req.body.refreshToken);

    const resDto = new RefreshTokensResDto({ accessToken, user });
    return res.json(resDto);
  }
}