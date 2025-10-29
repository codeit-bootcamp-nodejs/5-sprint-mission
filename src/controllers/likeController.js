import { prismaClient } from '../lib/prismaClient.js';

async function handleLike(req, res, type, action) {
  const userId = req.user?.userId;
  const itemId = Number(req.params.id);
  if (!userId) return res.status(401).send({ message: '로그인 필요' });
  const where = { userId };
  if (type === 'article') where.articleId = itemId;
  if (type === 'product') where.productId = itemId;

  const existing = await prismaClient.like.findFirst({ where });

  if (action === 'like') {
    if (existing) return res.status(409).send({ message: '이미 좋아요를 눌렀습니다.' });
    const data = { userId };
    if (type === 'article') data.articleId = itemId;
    if (type === 'product') data.productId = itemId;
    await prismaClient.like.create({ data });
    return res.status(201).send({ message: '좋아요 완료' });
  }

  if (action === 'unlike') {
    if (!existing) return res.status(404).send({ message: '좋아요 기록 없음' });
    await prismaClient.like.delete({ where: { id: existing.id } });
    return res.send({ message: '좋아요 취소 완료' });
  }
}

export async function likeArticle(req, res) {
  return handleLike(req, res, 'article', 'like');
}

export async function unlikeArticle(req, res) {
  return handleLike(req, res, 'article', 'unlike');
}

export async function likeProduct(req, res) {
  return handleLike(req, res, 'product', 'like');
}

export async function unlikeProduct(req, res) {
  return handleLike(req, res, 'product', 'unlike');
}
