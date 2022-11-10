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
const mongoose_1 = require("mongoose");
const board_1 = __importDefault(require("./board"));
const cardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    dueDate: { type: Date, required: true },
    board: { type: mongoose_1.Schema.Types.ObjectId, ref: "board", required: true },
}, { timestamps: true });
cardSchema.methods.moveCard = function (boardId) {
    return __awaiter(this, void 0, void 0, function* () {
        const oldBoard = yield board_1.default.findOne({ _id: this.board }); // the original board
        if (oldBoard) {
            yield oldBoard.removeCard(this._id.toString());
        }
        const newBoard = yield board_1.default.findOne({ _id: boardId }); // the original board
        if (newBoard) {
            yield newBoard.addCard(this._id.toString());
        }
        this.board = boardId;
        return yield this.save();
    });
};
cardSchema.methods.delete = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const board = yield board_1.default.findOne({ _id: this.board }); // the original board
        if (board) {
            yield board.removeCard(this._id);
        }
        return yield this.remove();
    });
};
exports.default = (0, mongoose_1.model)("card", cardSchema);
