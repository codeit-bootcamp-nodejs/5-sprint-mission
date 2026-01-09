import { IUserQueryRepo } from "../../../application/port/repo/query/user.query.repo.interface";
import { UserView } from "../../../application/query/views/user.view";
import { BaseRepo } from "../base.repo";

export class UserQueryRepo extends BaseRepo implements IUserQueryRepo {
  async findUserById(id: string): Promise<UserView | null> {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });

    if(!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      image: user.image ?? undefined
    };
  }
}