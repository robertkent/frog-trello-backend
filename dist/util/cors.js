"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
/**
 * To allow local react to access local node
 */
const cors = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
};
exports.cors = cors;
