const server = require("./server");
const request = require("supertest");
const db = require("../data/dbConfig");


beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeAll(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});


test("sanity", () => {
  expect(true).toBe(true)
})

describe("[POST] /api/auth/register", () => {
  
  it("registers new user", async () => {
    const user = { username: "leon", password: "123" };
    const res = await request(server).post("/api/auth/register").send(user);
    const expected = { id: 1, username: "leon" };
    
    expect(res.body).toMatchObject(expected);
    expect(res.status).toBe(201);
  })
  
  it("returns newly created user", async () => {
    const user = { username: "furion", password: "123" };
    const res = await request(server).post("/api/auth/register").send(user);

    expect(res.body.id).toEqual(2);
    expect(res.body.username).toEqual("furion");
  })
})

describe("[POST] /api/auth/login", () => {
  it("responds on missing body", async () => {
    const response = await request(server).post("/api/auth/login").send({ username: "leon" });

    expect(response.body.message).toEqual("username and password required")
  })

  it("can login", async () => {
    const response = await request(server).post("/api/auth/login").send({ username: "leon", password: "123" });

    expect(response.body.message).toEqual("welcome, leon");
  })
})


describe("[GET] /api/jokes", () => {
  it("no token error", async () => {
    const res = await request(server).get("/api/jokes");

    expect(res.body.message).toEqual("token required");
  })
  it("invalid token", async () => {
    const res = await request(server).get("/api/jokes").set("Authorization", "awdfsfsd");

    expect(res.body.message).toEqual("invalid token");
  })
})