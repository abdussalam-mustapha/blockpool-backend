"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const waitlistController_1 = require("../controllers/waitlistController");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
router.post('/', (0, validationMiddleware_1.validateRequest)(validationMiddleware_1.waitlistValidationRules), waitlistController_1.addToWaitlist);
exports.default = router;
