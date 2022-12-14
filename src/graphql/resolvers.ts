import Board from "../models/board";
import Card from "../models/card";
import { RequestHandler } from "express";
const validator = require("validator");

/**
 * Most resolvers are the same - or at least we can expect a promise with different return data.
 * To clear up this file I've just created a ResolverType than expects an object - as all return an object.
 *
 * Could make this clearer per type e.g. Promise<{ board: Board[] }
 */
type ResolverType = (
  { input }: { input: any },
  req: RequestHandler
) => Promise<{}>;

const reset: ResolverType = async ({ input }, req) => {
  await Card.deleteMany({});
  await Board.deleteMany({});

  const boards = await Board.find().populate("cards");

  return { boards: boards };
};

const deleteBoard: ResolverType = async ({ input }, req) => {
  const boardId = input.boardId;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("could not find the board to delete!");
  }

  const deletedBoard = await board.delete();

  return {
    _id: deletedBoard._id.toString(),
    title: deletedBoard.title,
    cards: deletedBoard.cards,
  };
};

const deleteCard: ResolverType = async ({ input }, req) => {
  const cardId = input.cardId;

  const card = await Card.findById(cardId);

  if (!card) {
    throw new Error("could not find the card to delete!");
  }

  const deletedCard = await card.delete();

  return {
    _id: deletedCard._id.toString(),
    title: deletedCard.title,
    description: deletedCard.description,
    dueDate: deletedCard.dueDate,
  };
};

const reorderCards: ResolverType = async ({ input }, req) => {
  const cardIds = input.cardIds;
  const boardId = input.boardId;

  const board = await Board.findById(boardId);

  if (!board) {
    throw new Error("could not find the board to reorder the cards!");
  }

  const updatedBoard = await board.reorderCards(cardIds);

  return {
    _id: updatedBoard._id,
    title: updatedBoard.title,
    cards: updatedBoard.cards,
  };
};

const moveCard: ResolverType = async ({ input }, req) => {
  const cardId = input.cardId;
  const boardId = input.boardId;

  const card = await Card.findById(cardId);
  if (!card) {
    throw new Error("could not find the card");
  }

  const updatedCard = await card.moveCard(boardId);

  return {
    _id: updatedCard._id.toString(),
    title: updatedCard.title,
    description: updatedCard.description,
    dueDate: updatedCard.dueDate,
  };
};

const getBoards: ResolverType = async ({ input }, req) => {
  const boards = await Board.find().populate("cards");

  return { boards: boards };
};

const createCard: ResolverType = async ({ input }, req) => {
  const errors: { message: String }[] = [];

  if (validator.isEmpty(input.title)) {
    errors.push({ message: "Please enter a valid title." });
  }

  if (validator.isEmpty(input.dueDate)) {
    errors.push({ message: "Please enter a valid due date." });
  }

  if (validator.isEmpty(input.board)) {
    errors.push({ message: "A card must be assigned to a board." });
  }

  const board = await Board.findById(input.board);

  if (board && errors.length === 0) {
    const card = await new Card({
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      board: input.board,
    });

    const storedCard = await card.save();
    await board.addCard(storedCard._id);

    return {
      _id: storedCard._id.toString(),
      title: storedCard.title,
      description: storedCard.description,
      dueDate: storedCard.dueDate,
    };
  } else {
    errors.push({ message: "Could not connect to the board." });
  }

  if (errors.length > 0) {
    let error: Error = new Error("An error occured");
    // @ts-ignore
    error.data = errors;
    // @ts-ignore
    error.code = 422;
    throw error;
  }

  return Promise.reject();
};

const createBoard: ResolverType = async ({ input }, req) => {
  const errors: { message: String }[] = [];

  if (validator.isEmpty(input.title)) {
    errors.push({ message: "Please enter a valid title." });
  }

  if (errors.length > 0) {
    let error: Error = new Error("An error occured");
    // @ts-ignore
    error.data = errors;
    // @ts-ignore
    error.code = 422;
    throw error;
  }

  const board = await new Board({
    title: input.title,
  });

  const storedBoard = await board.save();

  return { _id: storedBoard._id.toString(), title: storedBoard.title };
};

const test = () => {
  return true;
};

export default {
  test,
  createBoard,
  createCard,
  getBoards,
  moveCard,
  reorderCards,
  deleteCard,
  deleteBoard,
  reset,
};
