"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const report_controller_1 = require("../controller/report.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
console.log("chala");
router.post("/", auth_1.authMiddleware, report_controller_1.talkReport);
exports.default = router;
