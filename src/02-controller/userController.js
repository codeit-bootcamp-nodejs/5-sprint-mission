import { UserService } from "../common/const/03-service/userService.js";

export class UserController {
  #userService;
  constructor(userService) {
    this.#userService = userService;
  }

  signup = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;
      const user = await this.#userService.signup({ email, nickname, password });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.#userService.login({ email, password });
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await this.#userService.refreshToken(refreshToken);
      res.status(200).json(tokens);
    } catch (err) {
      next(err);
    }
  };

  getProfile = async (req, res, next) => {
    try {
    const userId = req.user.id;
    const user = await this.#userService.getProfile(userId);
    res.status(200).json(user);
  } catch (err) { next(err); }
  };

  updateProfile = async (req, res, next) => {
    try {
    const userId = req.user.id;
    const updateData = req.body;
    const updated = await this.#userService.updateProfile(userId, updateData);
    res.status(200).json(updated);
  } catch (err) { next(err); }
  };

changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    await this.#userService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) { next(err); }
};

  getUserProducts = async (req, res, next) => {
    try {
    const userId = req.user.id;
    const products = await this.#userService.getUserProducts(userId);
    res.status(200).json(products);
  } catch (err) { next(err); }
  };
}
