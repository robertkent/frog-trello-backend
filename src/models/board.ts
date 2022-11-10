import { Model, model, Schema } from "mongoose";
import Card from "./card";

interface IBoard {
  _id: Schema.Types.ObjectId;
  title: string;
  cards: Schema.Types.ObjectId[];
}

interface IBoardMethods {
  addCard(cardId: Schema.Types.ObjectId): Promise<IBoard>;
  removeCard(cardId: Schema.Types.ObjectId): Promise<IBoard>;
  reorderCards(cardIds: Schema.Types.ObjectId[]): Promise<IBoard>;
  delete(): Promise<IBoard>;
}

type BoardModel = Model<IBoard, {}, IBoardMethods>;

const boardSchema = new Schema<IBoard, BoardModel, IBoardMethods>(
  {
    title: { type: String, required: true },
    cards: [{ type: Schema.Types.ObjectId, ref: "card" }],
  },
  { timestamps: true }
);

boardSchema.methods.addCard = async function (cardId: Schema.Types.ObjectId) {
  const updatedCards = [...this.cards];
  updatedCards.unshift(cardId);
  this.cards = updatedCards;

  return await this.save();
};

/**
 * This is an alternative to the includes that you can find @reorderCards.
 *
 * Instead of typing as ObjectID we could also convert to strings and compare.
 *
 * Without this filter() can't compare 2x Object IDs (even if the variables are equal
 * - same with array.find or indexOf
 *
 */
boardSchema.methods.removeCard = async function (
  cardId: Schema.Types.ObjectId
) {
  this.cards = this.cards.filter(
    (card: any) => card.toString() !== cardId.toString()
  );

  return await this.save();
};

/**
 * Should have a check here to make sure we're not passing in anything that's not a valid cardID
 *
 * More validation required than just this - but essentially we're setting a list of IDs in a non-relational
 * DB so something should be done at least.
 *
 * Might not have time to implement this on the frontend as it'll require an additional sortable feature within
 * the same list.
 */
boardSchema.methods.reorderCards = async function (
  cardIds: Schema.Types.ObjectId[]
) {
  const different = cardIds.filter(
    (card: Schema.Types.ObjectId) => !this.cards.includes(card)
  );

  if (different.length) {
    throw new Error("Unidentified card in the request");
  }

  this.cards = cardIds;
  return await this.save();
};

boardSchema.methods.delete = async function () {
  await Card.deleteMany({ board: this._id });

  return await this.remove();
};

export default model("board", boardSchema);
