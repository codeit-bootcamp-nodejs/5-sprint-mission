import { UserEntity } from "../../02-domain/entity/user.entity";
import { PersistUser } from "../repo/user.repository";

export class UserMapper {
    static toPersist(record: PersistUser) {
        return UserEntity.createPersist({
            id: record.id,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
            email: record.email,
            nickname: record.nickname,
            password: record.password,
            refreshToken: record.refreshToken,
            image: record.image || undefined,
        });
    }
}