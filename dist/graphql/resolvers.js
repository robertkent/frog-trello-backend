"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("../models/board"));
const card_1 = __importDefault(require("../models/card"));
const validator = require("validator");
const deleteCard = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = input.cardId;
    const card = yield card_1.default.findById(cardId);
    if (!card) {
        throw new Error("could not find the card to delete!");
    }
    const updatedCard = yield card.delete();
    return {
        _id: updatedCard._id.toString(),
        title: updatedCard.title,
        description: updatedCard.description,
        dueDate: updatedCard.dueDate,
    };
});
const reorderCards = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const cardIds = input.cardIds;
    const boardId = input.boardId;
    const board = yield board_1.default.findById(boardId);
    if (!board) {
        throw new Error("could not find the board to reorder the cards!");
    }
    const updatedBoard = yield board.reorderCards(cardIds);
    return {
        _id: updatedBoard._id,
        title: updatedBoard.title,
        cards: updatedBoard.cards,
    };
});
const moveCard = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = input.cardId;
    const boardId = input.boardId;
    const card = yield card_1.default.findById(cardId);
    if (!card) {
        throw new Error("could not find the card");
    }
    const updatedCard = yield card.moveCard(boardId);
    return {
        _id: updatedCard._id.toString(),
        title: updatedCard.title,
        description: updatedCard.description,
        dueDate: updatedCard.dueDate,
    };
});
const getBoards = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const boards = yield board_1.default.find().populate("cards");
    return { boards: boards };
});
const createCard = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    if (validator.isEmpty(input.title)) {
        errors.push({ message: "Please enter a valid title." });
    }
    if (validator.isEmpty(input.dueDate)) {
        errors.push({ message: "Please enter a valid due date." });
    }
    if (validator.isEmpty(input.board)) {
        errors.push({ message: "A card must be assigned to a board." });
    }
    const board = yield board_1.default.findById(input.board);
    if (board && errors.length === 0) {
        const card = yield new card_1.default({
            title: input.title,
            description: input.description,
            dueDate: input.dueDate,
            board: input.board,
        });
        const storedCard = yield card.save();
        yield board.addCard(storedCard._id);
        return {
            _id: storedCard._id.toString(),
            title: storedCard.title,
            description: storedCard.description,
            dueDate: storedCard.dueDate,
        };
    }
    else {
        errors.push({ message: "Could not connect to the board." });
    }
    if (errors.length > 0) {
        let error = new Error("An error occured");
        // @ts-ignore
        error.data = errors;
        // @ts-ignore
        error.code = 422;
        throw error;
    }
    return Promise.reject();
});
const createBoard = ({ input }, req) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = [];
    if (validator.isEmpty(input.title)) {
        errors.push({ message: "Please enter a valid title." });
    }
    if (errors.length > 0) {
        let error = new Error("An error occured");
        // @ts-ignore
        error.data = errors;
        // @ts-ignore
        error.code = 422;
        throw error;
    }
    const board = yield new board_1.default({
        title: input.title,
    });
    const storedBoard = yield board.save();
    return { _id: storedBoard._id.toString(), title: storedBoard.title };
});
const test = () => {
    return true;
};
exports.default = {
    test,
    createBoard,
    createCard,
    getBoards,
    moveCard,
    reorderCards,
    deleteCard,
};
