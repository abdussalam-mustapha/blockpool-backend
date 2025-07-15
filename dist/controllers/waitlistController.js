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
exports.addToWaitlist = void 0;
const Waitlist_1 = __importDefault(require("../models/Waitlist"));
/**
 * @desc    Add user to waitlist
 * @route   POST /api/waitlist
 * @access  Public
 */
const addToWaitlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: 'Please provide name and email' });
        return;
    }
    try {
        const newEntry = new Waitlist_1.default({ name, email });
        yield newEntry.save();
        res.status(201).json({ message: 'Successfully added to waitlist' });
    }
    catch (error) {
        // Check for duplicate key error (email)
        if (error.code === 11000) {
            res.status(409).json({ message: 'This email is already on the waitlist.' });
            return;
        }
        res.status(500).json({ message: 'Error adding to waitlist', error });
    }
});
exports.addToWaitlist = addToWaitlist;
