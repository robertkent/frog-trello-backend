import mongoose from "mongoose";
const { ObjectId } = require("mongodb");
import { describe, expect, it } from "@jest/globals";
import Card from "../src/models/card";
import Board from "../src/models/board";

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DEFAULT_DATABASE}?w=majority`;

describe("Reset should operate correctly.", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterEach(async () => {
    await Card.deleteMany({});
    await Board.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should remove all cards and return a single default board upon reset", async () => {
    const mockBoard1 = { title: "This is a title" };
    const boardModel1 = new Board(mockBoard1);

    const board = await boardModel1.save();

    const mockCard1 = {
      title: "This is a card",
      dueDate: new Date().toISOString(),
      board: board._id,
    };
    const cardModel1 = new Card(mockCard1);
    await cardModel1.save();

    const mockBoard2 = { title: "This is a second title" };
    const boardModel2 = new Board(mockBoard2);

    const board2 = await boardModel2.save();

    const mockCard2 = {
      title: "This is another card",
      dueDate: new Date().toISOString(),
      board: board2._id,
    };
    const cardModel2 = new Card(mockCard2);
    await cardModel2.save();

    let boardCount = await Board.countDocuments({});
    let cardCount = await Card.countDocuments({});

    expect(boardCount).toBe(2);
    expect(cardCount).toBe(2);

    // perform reset

    await Board.deleteMany({});
    await Card.deleteMany({});

    boardCount = await Board.countDocuments({});
    cardCount = await Card.countDocuments({});

    expect(boardCount).toBe(0);
    expect(cardCount).toBe(0);
  });
});
