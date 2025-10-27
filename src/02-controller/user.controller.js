import { UserService } from "../03-service/user.service.js";
const userService = new UserService();

export class UserController {
  signup = async (req, res, next) => {
    try {
      const user = await userService.signup(req.body);
      res.status(201).json(user);
    } catch (e) { next(e); }
  };

  signin = async (req, res, next) => {
    try {
      const tokens = await userService.signin(req.body);
      res.status(200).json(tokens);
    } catch (e) { next(e); }
  };

  refresh = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const token = await userService.refresh(refreshToken);
      res.status(200).json(token);
    } catch (e) { next(e); }
  };

  me = async (req, res, next) => {
    try {
      const me = await userService.getMe(req.user.id);
      res.status(200).json(me);
    } catch (e) { next(e); }
  };

  updateProfile = async (req, res, next) => {
    try {
      const updated = await userService.updateProfile(req.user.id, req.body);
      res.status(200).json(updated);
    } catch (e) { next(e); }
  };

  changePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, oldPassword, newPassword);
      res.status(200).json({ message: "비밀번호 변경 완료" });
    } catch (e) { next(e); }
  };

  myProducts = async (req, res, next) => {
    try {
      const page = Math.max(1, Number(req.query.page || 1));
      const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
      const skip = (page - 1) * limit;
      const items = await userService.listMyProducts(req.user.id, { skip, take: limit });
      res.status(200).json({ items, page, limit });
    } catch (e) { next(e); }
  };
}
