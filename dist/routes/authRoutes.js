"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
router.post('/register', (0, validationMiddleware_1.validateRequest)(validationMiddleware_1.authValidationRules), authController_1.registerUser);
router.post('/login', (0, validationMiddleware_1.validateRequest)(validationMiddleware_1.authValidationRules), authController_1.loginUser);
exports.default = router;
