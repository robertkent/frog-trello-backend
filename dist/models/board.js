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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const boardSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    cards: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "card" }],
}, { timestamps: true });
boardSchema.methods.addCard = function (cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedCards = [...this.cards];
        updatedCards.push(cardId);
        this.cards = updatedCards;
        return yield this.save();
    });
};
boardSchema.methods.removeCard = function (cardId) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedCards = [...this.cards];
        updatedCards.splice(updatedCards.indexOf(cardId), 1);
        this.cards = updatedCards;
        return yield this.save();
    });
};
/**
 * Should have a check here to make sure we're not passing in anything that's not a valid cardID
 *
 * @param cardIds
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
exports.default = (0, mongoose_1.model)("board", boardSchema);
