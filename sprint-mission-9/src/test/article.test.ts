import { createApp } from "../app";
import { prismaClient } from "../lib/prismaClient";
import request from 'supertest'

const app = createApp();

const user = {
  email: 'user@test.com',
  nickname: 'tt',
  password: '1111',
  image: null as string | null
}

const otherUser = {
  email: 'otherUser@test.com',
  nickname: 'oo',
  password: '2222',
  image: null as string | null,
}

async function getAuthSession(u = user) {
  await request(app).post('/auth/register').send(u)
  const loginRes = await request(app).post('/auth/login').send({
    email: u.email,
    password: u.password,
  })
  const cookies = loginRes.get('Set-Cookie') ?? []
  const registeredUser = await prismaClient.user.findUnique({ where: { email: u.email } })
  return { cookies, user: registeredUser! }
}

async function seedArticles() {
  const testUser = await prismaClient.user.create({ data: user })

  const [firstArticle, secondArticle] = await Promise.all([
    prismaClient.article.create({
      data: {
        title: '첫 글',
        content: '첫 글 내용',
        image: null,
        userId: testUser.id,
      }
    }),
    prismaClient.article.create({
      data: {
        title: '두 번째 글',
        content: '두 번째 내용',
        image: null,
        userId: testUser.id,
      }
    })
  ])
  return { testUser, firstArticle, secondArticle }
}

async function seedOwnedArticle() {
  const { cookies, user: owner } = await getAuthSession()
  const created = await request(app)
    .post('/articles')
    .set('Cookie', cookies)
    .send({ title: '제목', content: '내용', image: null })
  return { article: created.body, cookies, owner }
}

beforeAll(async () => {
  await prismaClient.$connect();
})

beforeEach(async () => {
  await prismaClient.$executeRaw`TRUNCATE "Article", "Like", "Comment","User" RESTART IDENTITY CASCADE;`
})

afterAll(async () => {
  await prismaClient.$disconnect();
})

describe('게시글 API(비인증)', () => {
  it('GET /articles: 인증 없이 리스트 조회', async () => {
    const { firstArticle, secondArticle } = await seedArticles()

    const res = await request(app).get('/articles')

    expect(res.status).toBe(200)
    expect(res.body.totalCount).toBe(2)
    const titles = res.body.list.map((a: any) => a.title)
    expect(titles).toEqual(expect.arrayContaining([firstArticle.title, secondArticle.title]))
    expect(res.body.list[0]).not.toHaveProperty('likes')
  })

  it('GET /articles/:id: 인증 없이 단건 조회', async () => {
    const { firstArticle } = await seedArticles()

    const res = await request(app).get(`/articles/${firstArticle.id}`)

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: firstArticle.id,
      title: firstArticle.title,
      likeCount: 0,
    })
    expect(res.body).not.toHaveProperty('likes')
  })

  it('GET /articles/:id/comments: 인증 없이 댓글 목록 조회', async () => {
    const { testUser, firstArticle } = await seedArticles()
    const testComment = await prismaClient.comment.create({
      data: {
        content: '첫 댓글',
        articleId: firstArticle.id,
        productId: null,
        userId: testUser.id,
      },
    })

    const res = await request(app).get(`/articles/${firstArticle.id}/comments`)

    expect(res.status).toBe(200)
    expect(res.body.list).toHaveLength(1)
    expect(res.body.list[0]).toMatchObject({
      id: testComment.id,
      content: testComment.content,
      articleId: firstArticle.id,
      userId: testUser.id,
    })
  })
})

describe('게시글 API(인증)', () => {
  it('POST /articles: 미인증이면 401', async () => {
    const res = await request(app).post('/articles').send({ title: 't', content: 'c', image: null })
    expect(res.status).toBe(401)
  })

  it('POST /articles: 인증 유저 게시글 생성', async () => {
    const { cookies } = await getAuthSession()

    const res = await request(app)
      .post('/articles')
      .set('Cookie', cookies)
      .send({ title: 't', content: 'c', image: null })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: 't',
      content: 'c',
      likeCount: 0,
      isLiked: false,
    })
  })

  it('PATCH /articles/:id: 작성자 수정 성공', async () => {
    const { cookies, article } = await seedOwnedArticle();

    const res = await request(app).patch(`/articles/${article.id}`).set('Cookie', cookies).send({ content: '내가 변경' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: article.id, content: '내가 변경' })
  })

  it('PATCH /articles/:id: 작성자만 수정 가능', async () => {
    const { article } = await seedOwnedArticle()

    const { cookies: otherUserCookies } = await getAuthSession(otherUser)

    const res = await request(app)
      .patch(`/articles/${article.id}`)
      .set('Cookie', otherUserCookies)
      .send({ content: '변경변경' })
    expect(res.status).toBe(403)
  })

  it('DELETE /articles/:id: 작성자만 삭제 가능', async () => {
    const { article, cookies } = await seedOwnedArticle()

    const res = await request(app).delete(`/articles/${article.id}`).set('Cookie', cookies)
    expect(res.status).toBe(204)

    const check = await prismaClient.article.findUnique({ where: { id: article.id } })
    expect(check).toBeNull()
  })

  // comment
  it('POST /articles/:id/comments: 정상 생성 201', async () => {
    const { article } = await seedOwnedArticle()
    const { cookies, user: commenter } = await getAuthSession(otherUser)

    const res = await request(app)
      .post(`/articles/${article.id}/comments`)
      .set('Cookie', cookies)
      .send({ content: '댓글 내용' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      content: '댓글 내용',
      articleId: article.id,
      userId: commenter.id,
    })
  })

  //like
  it('POST /articles/:id/likes: 좋아요 201/취소 204', async () => {
    const { article, cookies } = await seedOwnedArticle()

    const likeRes = await request(app).post(`/articles/${article.id}/likes`).set('Cookie', cookies)
    expect(likeRes.status).toBe(201)

    const unlikeRes = await request(app).delete(`/articles/${article.id}/likes`).set('Cookie', cookies)
    expect(unlikeRes.status).toBe(204)
  })

})
