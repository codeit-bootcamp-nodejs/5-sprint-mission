export function validateUpdateMe(req, res, next) {
  const { nickname, image } = req.body;

  if (!nickname && !image) {
    return res
      .status(400)
      .json({ error: "수정할 내용을 하나 이상 입력해주세요." });
  }

  if (nickname) {
    if (typeof nickname !== "string" || nickname.length < 2 || nickname.length > 15) {
      return res
        .status(400)
        .json({ error: "닉네임은 2자 이상 15자 이하로 설정해주세요." });
    }
  }

  if (image) {
    if (typeof image !== "string") {
      return res.status(400).json({ error: "이미지 경로는 문자열이어야 합니다." });
    }
  }

  next();
}

export function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return res.status(400).json({ error: "모든 비밀번호 필드를 입력해주세요." });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ error: "새 비밀번호는 6자 이상이어야 합니다." });
  }

  if (newPassword !== newPasswordConfirm) {
    return res.status(400).json({ error: "새 비밀번호가 일치하지 않습니다." });
  }

  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ error: "현재 비밀번호와 새 비밀번호가 동일합니다." });
  }

  next();
}
