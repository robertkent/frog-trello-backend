import mongoose, { Error, MongooseError } from "mongoose";
import { describe, expect, it } from "@jest/globals";
import Board from "../src/models/board";

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DEFAULT_DATABASE}?w=majority`;

/**
 * Using a remote Testing DB here - there are ways to use in-memory mongoDB instances too for testing.
 */
describe("Boards should validate correctly.", () => {
  beforeEach(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterEach(async () => {
    await Board.deleteMany({});
    await mongoose.connection.close();
  });

  it("should throw an error if the title is not provided", async () => {
    const mockBoard = { title: "" };
    const boardModel = new Board(mockBoard);

    await expect(boardModel.save()).rejects.toThrow();
  });

  it("should return an ID for a created board", async () => {
    const mockBoard = { title: "A test board" };
    const boardModel = new Board(mockBoard);

    const savedBoard = await boardModel.save();

    expect(savedBoard).toHaveProperty("_id");
  });

  it("should find a board by the given title", async () => {
    const mockBoard = { title: "A test board" };
    const boardModel = new Board(mockBoard);

    const savedBoard = await boardModel.save();

    const foundBoard = await Board.findOne({ title: mockBoard.title });

    expect(foundBoard).toHaveProperty("title", mockBoard.title);
  });

  it("should return an empty cards array for a given board", async () => {
    const mockBoard = { title: "A test board" };
    const boardModel = new Board(mockBoard);

    const savedBoard = await boardModel.save();

    expect(savedBoard).toHaveProperty("cards", []);
  });

  it("should remove a board", async () => {
    const mockBoard = { title: "A test board" };
    const boardModel = new Board(mockBoard);

    const savedBoard = await boardModel.save();

    expect(savedBoard).toHaveProperty("cards", []);

    await savedBoard.delete();

    const boardCount = await Board.countDocuments({});

    expect(boardCount).toBe(0);
  });
});
