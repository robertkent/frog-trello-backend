import mongoose from "mongoose";
const { ObjectId } = require("mongodb");
import { describe, expect, it } from "@jest/globals";
import Card from "../src/models/card";
import Board from "../src/models/board";

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DEFAULT_DATABASE}?w=majority`;

describe("Cards should operate correctly.", () => {
  beforeEach(async () => {
    await mongoose.connect(MONGODB_URI);
  });

  afterEach(async () => {
    await Card.deleteMany({});
    await mongoose.connection.close();
  });

  it("should throw an error if the dueDate is not provided", async () => {
    const mockCard = { title: "This is a title" };
    const cardModel = new Card(mockCard);

    await expect(cardModel.save()).rejects.toThrow();
  });

  it("should create a card successfully if all required data provided", async () => {
    const mockCard = {
      title: "A test card",
      dueDate: new Date().toISOString(),
      board: ObjectId("1".repeat(24)),
    };
    const cardModel = new Card(mockCard);

    const savedCard = await cardModel.save();

    expect(savedCard).toHaveProperty("_id");
  });

  it("should be able a delete a card", async () => {
    const mockCard = {
      title: "A test card",
      dueDate: new Date().toISOString(),
      board: ObjectId("1".repeat(24)),
    };
    const cardModel = new Card(mockCard);

    const savedCard = await cardModel.save();

    expect(savedCard).toHaveProperty("_id");

    await savedCard.remove();

    const cards = await Card.find();

    expect(cards.length).toBe(0);
  });
});
