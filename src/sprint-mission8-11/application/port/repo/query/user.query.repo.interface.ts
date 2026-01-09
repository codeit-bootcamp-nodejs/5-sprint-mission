import { UserView } from "../../../query/views/user.view";

export interface IUserQueryRepo {
  findUserById(id: string): Promise<UserView | null>;
}