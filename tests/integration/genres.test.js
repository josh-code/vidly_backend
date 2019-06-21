const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const mongoose = require("mongoose");

describe("/api/genres", () => {
  let app;
  beforeEach(() => {
    app = require("../../index");
  });

  afterEach(async () => {
    await Genre.remove({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);
      const res = await request(app).get("/api/genres");

      expect(res.status).toBe(200);
      //   expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === "genre1")).toBeTruthy;
      expect(res.body.some(g => g.name === "genre2")).toBeTruthy;
    });
  });

  describe("GET /:id", () => {
    it("Should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(app).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("Should return 404 if invalid id is passed", async () => {
      const res = await request(app).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("Should return 404 if no genre with given id exits", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(app).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    let name;

    const exec = async () => {
      return await request(app)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("Should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is less than 5 charecters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more than 50 charecters", async () => {
      name = Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });

      expect(genre).not.toBeNull();
    });

    it("Should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
      //   app.close();
    });
  });

  describe("PUT /", () => {
    let token;
    let name;
    let genre;

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    const createGenre = async () => {
      genre = new Genre({ name: "1genre" });
      await genre.save();
    };

    const exec = async () => {
      return await request(app)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("Should return 400 if genre is less than 5 charecters", async () => {
      name = "1234";
      await createGenre();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("Should return 404 if specified genre does not exist", async () => {
      genre._id = "a";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("Should return and update the genre", async () => {
      await createGenre();
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", name);
    });
  });

  describe("DELETE /", () => {
    let genre;
    let name;
    let id;

    beforeEach(async () => {
      genre = new Genre({ name: "genre1" });
      await genre.save();

      id = genre._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    const exec = async () => {
      return await request(app)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token);
    };

    it("should return 200 if genre is deleted", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    // it("Should return 404 if specified genre does not exist", async () => {
    //   id = mongoose.Types.ObjectId();
    //   const res = await exec();
    //   expect(res.status).toBe(404);
    // });
  });
});
