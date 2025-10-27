import bcrypt from "bcrypt";

const SALT_LEVEL = 10;

export class HashManager {
  hashingPassword = async (password) => {
    const salt = await bcrypt.genSalt(SALT_LEVEL);
    return await bcrypt.hash(password, salt);
  };

  verifyPassword = async (plainPassword, hashedPasswordFromDB) => {
    return await bcrypt.compare(plainPassword, hashedPasswordFromDB);
  };
}
