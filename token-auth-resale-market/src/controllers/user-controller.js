import { UserService } from "../services/user-service.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserController {
  constructor() {
    this.userService = new UserService(prisma);
  }

  getMyInfo = async (req, res) => {
    const userId = req.user.userId;
    const user = await this.userService.getMyInfo(userId);
    if (!user) throw new Exception(404, "사용자를 찾을 수 없습니다");

    res.json(user);
  };

  updateMyInfo = async (req, res) => {
    const userId = req.user.userId;
    const updateData = req.body;
    const updatedUser = await this.userService.updateMyInfo(userId, updateData);

    res.json(updatedUser);
  };

  changePassword = async (req, res) => {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      throw new Exception(400, "현재 비밀번호와 새 비밀번호를 입력해주세요");
    if (newPassword.length < 6)
      throw new Exception(400, "새 비밀번호는 최소 6자 이상이어야 합니다");
    const updatedUser = await this.userService.changePassword(userId, {
      currentPassword,
      newPassword,
    });

    res.json(updatedUser)
  };

  getMyProducts = async (req, res) => {
    const userId = req.user.userId;
    const query = req.query;
    const products = await this.userService.getMyProducts(userId, query);
    
    res.json(products)
  };
}
