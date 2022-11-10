import mongoose from "mongoose";
const { ObjectId } = require("mongodb");
import { describe, expect, it } from "@jest/globals";
import Card from "../src/models/card";
import Board from "../src/models/board";

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DEFAULT_DATABASE}?w=majority`;

describe("Cards can be added and removed from boards.", () => {
  beforeEach(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterEach(async () => {
    await Card.deleteMany({});
    await Board.deleteMany({});
    await mongoose.connection.close();
  });

  it("should allow a card to be added to a board", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard = {
      title: "This is a title",
      dueDate: new Date().toISOString(),
      board: savedBoard._id.toString(),
    };
    const savedCard = await new Card(mockCard).save();

    const updatedBoard = await Board.findById(savedBoard._id);
    if (updatedBoard) {
      await updatedBoard.addCard(savedCard._id);
      expect(updatedBoard).toHaveProperty("cards", [savedCard._id]);
    }

    expect(savedCard).toHaveProperty("board", savedBoard._id);
  });

  it("should allow multiple cards to be added to a board", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard1 = {
      title: "This is a title",
      dueDate: new Date().toISOString(),
      board: savedBoard._id.toString(),
    };
    const savedCard1 = await new Card(mockCard1).save();

    const mockCard2 = {
      title: "This is a different card",
      dueDate: new Date().toISOString(),
      board: savedBoard._id.toString(),
    };
    const savedCard2 = await new Card(mockCard2).save();

    await savedBoard.addCard(savedCard1._id);
    await savedBoard.addCard(savedCard2._id);

    const updatedBoard = await Board.findById(savedBoard._id);

    expect(updatedBoard).toHaveProperty("cards", [
      savedCard1._id,
      savedCard2._id,
    ]);
  });

  it("should allow a card to be moved from one board to another", async () => {
    const savedBoard1 = await new Board({ title: "A test board" }).save();
    const savedBoard2 = await new Board({ title: "Another test board" }).save();

    const mockCard = {
      title: "This is a title",
      dueDate: new Date().toISOString(),
      board: savedBoard1._id,
    };

    const savedCard = await new Card(mockCard).save();
    await savedBoard1.addCard(savedCard._id);

    expect(savedBoard1).toHaveProperty("cards", [savedCard._id]);

    await savedCard.moveCard(savedBoard2._id);

    const updatedBoard1 = await Board.findById(savedBoard1._id);
    const updatedBoard2 = await Board.findById(savedBoard2._id);

    expect(updatedBoard1).toHaveProperty("cards", []);
    expect(updatedBoard2).toHaveProperty("cards", [savedCard._id]);
  });

  it("should be able to order multiple cards within a board", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard1 = {
      title: "This is first position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard1 = await new Card(mockCard1).save();

    const mockCard2 = {
      title: "This is second position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard2 = await new Card(mockCard2).save();

    const mockCard3 = {
      title: "This is third position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard3 = await new Card(mockCard3).save();

    await savedBoard.addCard(savedCard1._id);
    await savedBoard.addCard(savedCard2._id);
    await savedBoard.addCard(savedCard3._id);

    const originalOrder = [savedCard1._id, savedCard2._id, savedCard3._id];

    expect(savedBoard).toHaveProperty("cards", originalOrder);

    const updatedOrder = [savedCard3._id, savedCard1._id, savedCard2._id];

    await savedBoard.reorderCards(updatedOrder);

    expect(savedBoard).toHaveProperty("cards", updatedOrder);
  });

  it("should not allow unverified card ids to be submitted to the request", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard1 = {
      title: "This is first position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard1 = await new Card(mockCard1).save();

    const mockCard2 = {
      title: "This is second position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard2 = await new Card(mockCard2).save();

    const mockCard3 = {
      title: "This is third position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard3 = await new Card(mockCard3).save();

    await savedBoard.addCard(savedCard1._id);
    await savedBoard.addCard(savedCard2._id);
    await savedBoard.addCard(savedCard3._id);

    const originalOrder = [savedCard1._id, savedCard2._id, savedCard3._id];

    expect(savedBoard).toHaveProperty("cards", originalOrder);

    const updatedOrder = [
      savedCard3._id,
      savedCard1._id,
      savedCard2._id,
      ObjectId("1".repeat(24)),
    ];

    await expect(savedBoard.reorderCards(updatedOrder)).rejects.toThrow();
  });

  it("should also remove from a board when a single card is deleted", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard = {
      title: "This is first position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard = await new Card(mockCard).save();

    await savedBoard.addCard(savedCard._id);

    await savedCard.delete();

    const updatedBoard = await Board.findById(savedBoard);

    expect(updatedBoard).toHaveProperty("cards", []);
  });

  it("should remove all cards associated with a board when that board is removed", async () => {
    const savedBoard = await new Board({ title: "A test board" }).save();

    const mockCard = {
      title: "This is first position",
      dueDate: new Date().toISOString(),
      board: savedBoard._id,
    };
    const savedCard = await new Card(mockCard).save();

    await savedBoard.addCard(savedCard._id);

    const updatedBoard = await Board.findById(savedBoard);

    expect(updatedBoard).toHaveProperty("cards", [savedCard._id]);

    const boardToDelete = await Board.findById(savedBoard);

    if (boardToDelete) {
      await boardToDelete.delete();
    }

    const cardCount = await Card.countDocuments({});

    expect(cardCount).toBe(0);
  });
});
