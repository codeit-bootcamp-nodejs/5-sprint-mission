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
  image: null as string | null
}

const product = {
  name: '테스트 상품',
  description: '상품 설명',
  price: 10000,
  tags: ['tag00'],
  images: ['test.jpg']
}

async function seedProducts() {
  const testUser = await prismaClient.user.create({ data: user })

  const [firstProduct, secondProduct] = await Promise.all([
    prismaClient.product.create({
      data: {
        name: '첫번째 상품',
        description: '첫 상품 설명',
        price: 1000,
        tags: ['tag1'],
        images: ['a.jpg'],
        userId: testUser.id,
      },
    }),
    prismaClient.product.create({
      data: {
        name: '두번째 상품',
        description: '둘째 상품 설명',
        price: 2000,
        tags: ['tag2'],
        images: ['b.jpg'],
        userId: testUser.id,
      },
    })
  ])
  return { testUser, firstProduct, secondProduct }
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

async function seedOwnedProduct() {
  const { cookies, user: owner } = await getAuthSession();
  const created = await request(app).post('/products').set('Cookie', cookies).send(product)

  return { cookies, owner, product: created.body }
}

beforeAll(async () => {
  await prismaClient.$connect();
})

beforeEach(async () => {
  await prismaClient.$executeRaw`TRUNCATE "Product", "Favorite", "Comment","User" RESTART IDENTITY CASCADE;`
})

afterAll(async () => {
  await prismaClient.$disconnect();
})

describe('상품 API (비인증)', () => {
  it('GET /products: 인증 없이 리스트 조회', async () => {
    const { firstProduct, secondProduct } = await seedProducts();

    const res = await request(app).get('/products')

    expect(res.status).toBe(200)
    expect(res.body.totalCount).toBe(2)

    const names = res.body.list.map((p: any) => p.name)
    expect(names).toEqual(expect.arrayContaining([firstProduct.name, secondProduct.name]))

    expect(res.body.list[0]).not.toHaveProperty('favorites')
  })

  it('GET /product: 인증 없이 단건 조회', async () => {
    const { firstProduct } = await seedProducts();
    const res = await request(app).get('/product')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      id: firstProduct.id,
      name: firstProduct.name,
      favoriteCount: 0,
    })
    expect(res.body).not.toHaveProperty('favorites')
  })

  it('GET /products/:id/comments 인증 없이 댓글 목록 조회', async () => {
    const { firstProduct, testUser } = await seedProducts();

    const testComment = await prismaClient.comment.create({
      data: {
        content: '첫 댓글',
        productId: firstProduct.id,
        articleId: null,
        userId: testUser.id
      }
    })
    const res = await request(app).get(`/product/${firstProduct.id}/comments`)

    expect(res.status).toBe(200)
    expect(res.body.list).toHaveLength(1)
    expect(res.body.list[0]).toMatchObject({
      id: testComment.id,
      content: testComment.content,
      producId: firstProduct.id,
      userId: testUser.id
    })
  })
})

describe('상품 API(인증)', () => {
  it('POST /products: 미인증이면 401', async () => {
    const res = await request(app).post('/products').send(product)

    expect(res.status).toBe(401)
  })

  it('POST /products: 인증 유저는 상품 생성', async () => {
    const { cookies } = await getAuthSession()

    const res = await request(app).post('/products').set('Cookie', cookies).send(product)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      name: product.name,
      favoriteCount: 0,
      isFavorited: false,
    })
  })

  it('PATCH /products/:id: 작성자 수정 성공', async () => {
    const { cookies, product } = await seedOwnedProduct();

    const res = await request(app).patch(`/products/${product.id}`).set('Cookie', cookies).send({ price: 1999 })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ id: product.id, price: 7777 })
  })

  it('PATCH /products/:id: 작성자만 수정 가능', async () => {
    const { product } = await seedOwnedProduct();

    const { cookies: otherCookies } = await getAuthSession(otherUser)

    const res = await request(app).patch(`/products/${product.id}`).set('Cookie', otherCookies).send({ price: 1999 })

    expect(res.status).toBe(403)

  })

  it('DELETE /products/:id: 작성자만 삭제 가능', async () => {
    const { product, cookies } = await seedOwnedProduct()

    const res = await request(app).delete(`/products/${product.id}`).set('Cookie', cookies)

    expect(res.status).toBe(204)
    const exists = await prismaClient.product.findUnique({ where: { id: product.id } })
    expect(exists).toBeNull()
  })

  //favorites
  it('POST /products/:id/favorites: 미인증유저 좋아요 401', async () => {
    const { product } = await seedOwnedProduct()

    const res = await request(app).post(`/products/${product.id}/favorites`)
    expect(res.status).toBe(401)
  })

  it('POST /products/:id/favorites: 상품 즐겨찾기', async () => {
    const { product } = await seedOwnedProduct()

    const { cookies: otherCookies } = await getAuthSession(otherUser)

    const res = await request(app).post(`/products/${product.id}/favorites`).set('Cookie', otherCookies)
    expect(res.status).toBe(201)

    const favorite = await prismaClient.favorite.findFirst({
      where: { productId: product.id, user: { email: otherUser.email } },
    })
    expect(favorite).not.toBeNull()

    const productWithFlag = await request(app).get(`/products/${product.id}`).set('Cookie', otherCookies)
    expect(productWithFlag.body).toMatchObject({ favoriteCount: 1, isFavorited: true })
  })

  it('DELETE /products/:id/favorites: 즐겨찾기 취소', async () => {
    const { product } = await seedOwnedProduct()

    const { cookies: otherCookies, user: other } = await getAuthSession(otherUser)

    await request(app).post(`/products/${product.id}/favorites`).set('Cookie', otherCookies)

    const res = await request(app).delete(`/products/${product.id}/favorites`).set('Cookie', otherCookies)
    expect(res.status).toBe(204)

    const remaining = await prismaClient.favorite.findFirst({
      where: { productId: product.id, userId: other.id },
    })
    expect(remaining).toBeNull()
  })

  //comments
  it('POST /products/:id/comments: 미인증이면 401', async () => {
    const { product } = await seedOwnedProduct()

    const res = await request(app).post(`/products/${product.id}/comments`).send({
      content: '코멘트',
    })

    expect(res.status).toBe(401)
  })

  it('POST /products/:id/comments: 인증 유저는 코멘트 생성 201', async () => {
    const { product } = await seedOwnedProduct()
    const { cookies: commenterCookies, user: commenter } = await getAuthSession(otherUser)

    const res = await request(app)
      .post(`/products/${product.id}/comments`)
      .set('Cookie', commenterCookies)
      .send({ content: '코멘트' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      content: '코멘트',
      productId: product.id,
      userId: commenter.id,
    })

    const saved = await prismaClient.comment.findUnique({ where: { id: res.body.id } })
    expect(saved).not.toBeNull()
  })
})
