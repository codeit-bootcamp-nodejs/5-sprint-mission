export function validateSignUp(req, res, next) {
  const { email, password, passwordConfirm, nickname } = req.body;

  if (!email || !password || !passwordConfirm || !nickname) {
    return res.status(400).json({ error: "모든 필드를 입력해주세요." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "유효하지 않은 이메일 형식입니다." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "비밀번호는 6자 이상이어야 합니다." });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ error: "비밀번호가 일치하지 않습니다." });
  }

  if (nickname.length < 2 || nickname.length > 15) {
    return res
      .status(400)
      .json({ error: "닉네임은 2자 이상 15자 이하로 설정해주세요." });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
  }

  next();
}

export function validateRefreshToken(req, res, next) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh Token이 필요합니다." });
  }

  next();
}
