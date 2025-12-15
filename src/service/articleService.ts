import type { PrismaClient } from "@prisma/client";
import { NotificationType } from "@prisma/client";
import type { NotificationService } from "./notificationService";

export class ArticleService {
  private prisma: PrismaClient;
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient, notificationService: NotificationService) {
    this.prisma = prisma;
    this.notificationService = notificationService;
  }

  // 게시글 생성
  async createArticle(userId: string, title: string, content: string) {
    return this.prisma.article.create({
      data: { userId, title, content },
    });
  }

  // 게시글 목록 조회
  async getArticles() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, nickname: true } },
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  // 게시글 좋아요 토글
  async toggleLike(articleId: string, userId: string) {
    const existed = await this.prisma.articleLike.findFirst({
      where: {
        articleId,
        userId,
      },
    });

    if (existed) {
      await this.prisma.articleLike.delete({
        where: { id: existed.id },
      });
      return { liked: false };
    }

    await this.prisma.articleLike.create({
      data: {
        articleId,
        userId,
      },
    });

    return { liked: true };
  }

  // 댓글 생성 및 알림
  async createComment(userId: string, articleId: string, content: string) {
    const comment = await this.prisma.articleComment.create({
      data: { content, userId, articleId },
      include: {
        article: { select: { userId: true, title: true } },
      },
    });

    if (comment.article.userId !== userId) {
      await this.notificationService.createNotification(
        comment.article.userId,
        NotificationType.ARTICLE_COMMENT_CREATED,
        `게시글 "${comment.article.title}"에 새로운 댓글이 달렸습니다.`,
      );
    }

    return comment;
  }
}