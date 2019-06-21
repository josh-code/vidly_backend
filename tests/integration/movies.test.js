const request = require("supertest");
const { Movie } = require("../../models/movie");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("api/movies", () => {
  let app;
  beforeEach(async () => {
    app = require("../../index");
  });

  describe("POST /", () => {
    let token;
    let movie = {};
    let genre;

    beforeEach(async () => {
      token = new User().generateAuthToken();

      genre = new Genre({
        name: "12345"
      });

      movie.title = "12345";
      await genre.save();
    });

    afterEach(async () => {
      await Movie.remove({});
      await Genre.remove({});
    });

    const exec = async () => {
      movie = {
        title: movie.title,
        genreId: genre._id,
        numberInStock: 10,
        dailyRentalRate: 2
      };

      return await request(app)
        .post("/api/movies")
        .set("x-auth-token", token)
        .send(movie);
    };

    it("Should return 400 if title is less than 5 charecters", async () => {
      movie.title = "123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 200 if request is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });
  });
});
