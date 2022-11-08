import { Model, model, Schema } from "mongoose";

interface IBoard {
  _id: Schema.Types.ObjectId;
  title: string;
  cards: Schema.Types.ObjectId[];
}

interface IBoardMethods {
  addCard(cardId: Schema.Types.ObjectId): Promise<IBoard>;
  removeCard(cardId: Schema.Types.ObjectId): Promise<IBoard>;
  reorderCards(cardIds: Schema.Types.ObjectId[]): Promise<IBoard>;
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
  updatedCards.push(cardId);
  this.cards = updatedCards;
  return await this.save();
};

boardSchema.methods.removeCard = async function (
  cardId: Schema.Types.ObjectId
) {
  const updatedCards = [...this.cards];

  updatedCards.splice(updatedCards.indexOf(cardId), 1);

  this.cards = updatedCards;

  return await this.save();
};

/**
 * Should have a check here to make sure we're not passing in anything that's not a valid cardID
 *
 * @param cardIds
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

export default model("board", boardSchema);
