"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth.controller");
const multer_1 = require("../middleware/multer");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/me", auth_1.authMiddleware, auth_controller_1.getMe);
router.post("/register", multer_1.adminPicUpload.single("avatar"), auth_controller_1.adminRegister);
router.post("/login", auth_controller_1.login);
router.get("/logout", auth_controller_1.logout);
exports.default = router;
