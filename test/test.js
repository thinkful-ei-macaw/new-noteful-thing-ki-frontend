/*
const knex = require("knex");
const app = require("./src/app");
const { makenotesArray, makeMaliciousnote } = require("./src/notes.fixtures");
const { makeUsersArray } = require("./users.fixtures");

describe("notes Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw(
      "TRUNCATE noteful_notes, noteful_users, noteful_comments RESTART IDENTITY CASCADE"
    )
  );

  afterEach("cleanup", () =>
    db.raw(
      "TRUNCATE noteful_notes, noteful_users, noteful_comments RESTART IDENTITY CASCADE"
    )
  );

  describe(`GET /api/notes`, () => {
    context(`Given no notes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/notes")
          .expect(200, []);
      });
    });

    context("Given there are notes in the database", () => {
      const testUsers = makeUsersArray();
      const testnotes = makenotesArray();

      beforeEach("insert notes", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert(testnotes);
          });
      });

      it("responds with 200 and all of the notes", () => {
        return supertest(app)
          .get("/api/notes")
          .expect(200, testnotes);
      });
    });

    context(`Given an XSS attack note`, () => {
      const testUsers = makeUsersArray();
      const { maliciousnote, expectednote } = makeMaliciousnote();

      beforeEach("insert malicious note", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert([maliciousnote]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/notes`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].title).to.eql(expectednote.title);
            expect(res.body[0].content).to.eql(expectednote.content);
          });
      });
    });
  });

  describe(`GET /api/notes/:note_id`, () => {
    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .get(`/api/notes/${noteId}`)
          .expect(404, { error: { message: `note doesn't exist` } });
      });
    });

    context("Given there are notes in the database", () => {
      const testUsers = makeUsersArray();
      const testnotes = makenotesArray();

      beforeEach("insert notes", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert(testnotes);
          });
      });

      it("responds with 200 and the specified note", () => {
        const noteId = 2;
        const expectednote = testnotes[noteId - 1];
        return supertest(app)
          .get(`/api/notes/${noteId}`)
          .expect(200, expectednote);
      });
    });

    context(`Given an XSS attack note`, () => {
      const testUsers = makeUsersArray();
      const { maliciousnote, expectednote } = makeMaliciousnote();

      beforeEach("insert malicious note", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert([maliciousnote]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/notes/${maliciousnote.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(expectednote.title);
            expect(res.body.content).to.eql(expectednote.content);
          });
      });
    });
  });

  describe(`POST /api/notes`, () => {
    const testUsers = makeUsersArray();
    beforeEach("insert malicious note", () => {
      return db.into("noteful_users").insert(testUsers);
    });

    it(`creates an note, responding with 201 and the new note`, () => {
      const newnote = {
        note_title: "Test new note",
        note_content: "Test new note content...",
      };
      return supertest(app)
        .post("/api/notes")
        .send(newnote)
        .expect(201)
        .expect((res) => {
          expect(res.body.note_title).to.eql(newnote.note_title);
          expect(res.body.note_content).to.eql(newnote.note_content);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/notes/${res.body.id}`);
          const expected = new Intl.DateTimeFormat("en-US").format(new Date());
          const actual = new Intl.DateTimeFormat("en-US").format(
            new Date(res.body.date_published)
          );
          expect(actual).to.eql(expected);
        })
        .then((res) =>
          supertest(app)
            .get(`/api/notes/${res.body.id}`)
            .expect(res.body)
        );
    });

    const requiredFields = ["note_title", "note_content"];

    requiredFields.forEach((field) => {
      const newnote = {
        note_title: "Test new note",
        note_content: "Test new note content...",
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newnote[field];

        return supertest(app)
          .post("/api/notes")
          .send(newnote)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content from response", () => {
      const { maliciousnote, expectednote } = makeMaliciousnote();
      return supertest(app)
        .post(`/api/notes`)
        .send(maliciousnote)
        .expect(201)
        .expect((res) => {
          expect(res.body.note_title).to.eql(expectednote.note_title);
          expect(res.body.note_content).to.eql(expectednote.note_content);
        });
    });
  });

  describe(`DELETE /api/notes/:note_id`, () => {
    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .delete(`/api/notes/${noteId}`)
          .expect(404, { error: { message: `note doesn't exist` } });
      });
    });

    context("Given there are notes in the database", () => {
      const testUsers = makeUsersArray();
      const testnotes = makenotesArray();

      beforeEach("insert notes", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert(testnotes);
          });
      });

      it("responds with 204 and removes the note", () => {
        const idToRemove = 2;
        const expectednotes = testnotes.filter(
          (note) => note.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/notes/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/notes`)
              .expect(expectednotes)
          );
      });
    });
  });

  describe(`PATCH /api/notes/:note_id`, () => {
    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .delete(`/api/notes/${noteId}`)
          .expect(404, { error: { message: `note doesn't exist` } });
      });
    });

    context("Given there are notes in the database", () => {
      const testUsers = makeUsersArray();
      const testnotes = makenotesArray();

      beforeEach("insert notes", () => {
        return db
          .into("noteful_users")
          .insert(testUsers)
          .then(() => {
            return db.into("noteful_notes").insert(testnotes);
          });
      });

      it("responds with 204 and updates the note", () => {
        const idToUpdate = 2;
        const updatenote = {
          title: "updated note title",
          style: "Interview",
          content: "updated note content",
        };
        const expectednote = {
          ...testnotes[idToUpdate - 1],
          ...updatenote,
        };
        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .send(updatenote)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/notes/${idToUpdate}`)
              .expect(expectednote)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'note_title' or 'note_content'`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updatenote = {
          title: "updated note title",
        };
        const expectednote = {
          ...testnotes[idToUpdate - 1],
          ...updatenote,
        };

        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .send({
            ...updatenote,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/notes/${idToUpdate}`)
              .expect(expectednote)
          );
      });
    });
  });
});

*/
