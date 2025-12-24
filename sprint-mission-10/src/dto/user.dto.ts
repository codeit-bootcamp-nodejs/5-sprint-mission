export interface UpdateMeDto {
  nickname?: string;
  image?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
