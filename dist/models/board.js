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
const card_1 = __importDefault(require("./card"));
const boardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    cards: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "card" }],
}, { timestamps: true });
boardSchema.methods.addCard = function (cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedCards = [...this.cards];
        updatedCards.unshift(cardId);
        this.cards = updatedCards;
        return yield this.save();
    });
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
boardSchema.methods.removeCard = function (cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        this.cards = this.cards.filter((card) => card.toString() !== cardId.toString());
        return yield this.save();
    });
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
boardSchema.methods.reorderCards = function (cardIds) {
    return __awaiter(this, void 0, void 0, function* () {
        const different = cardIds.filter((card) => !this.cards.includes(card));
        if (different.length) {
            throw new Error("Unidentified card in the request");
        }
        this.cards = cardIds;
        return yield this.save();
    });
};
boardSchema.methods.delete = function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield card_1.default.deleteMany({ board: this._id });
        return yield this.remove();
    });
};
exports.default = (0, mongoose_1.model)("board", boardSchema);
