import { Model, Schema, model } from "mongoose";
import Board from "./board";

interface ICard {
  _id: Schema.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  board: Schema.Types.ObjectId;
}

interface ICardMethods {
  moveCard(boardId: Schema.Types.ObjectId): Promise<ICard>;
  delete(): Promise<ICard>;
}

type CardModel = Model<ICard, {}, ICardMethods>;

const cardSchema = new Schema<ICard, CardModel, ICardMethods>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: true },
    board: { type: Schema.Types.ObjectId, ref: "board", required: true },
  },
  { timestamps: true }
);

cardSchema.methods.moveCard = async function (boardId: Schema.Types.ObjectId) {
  const oldBoard = await Board.findOne({ _id: this.board }); // the original board

  if (oldBoard) {
    await oldBoard.removeCard(this._id.toString());
  }

  const newBoard = await Board.findOne({ _id: boardId }); // the original board

  if (newBoard) {
    await newBoard.addCard(this._id.toString());
  }

  this.board = boardId;

  return await this.save();
};

cardSchema.methods.delete = async function () {
  const board = await Board.findOne({ _id: this.board }); // the original board

  if (board) {
    await board.removeCard(this._id);
  }

  return await this.remove();
};

export default model("card", cardSchema);
