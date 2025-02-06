const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../schema/db');
const mongoose = require('mongoose'); // Removed destructuring from require

const router = express.Router();

router.get("/balance", async (req, res) => {
    console.log(req.userId)
    try {
        const account = await Account.findOne({ userId: req.userId });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        res.json({ balance: account.balance });
    } catch (err) {
        console.error("Error fetching balance:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/transfer", async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        if (!amount || amount <= 0) {
            throw new Error("Invalid transfer amount");
        }

        // Fetch the sender's account
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            throw new Error("Insufficient balance");
        }

        // Fetch the recipient's account
        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            throw new Error("Invalid recipient account");
        }

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.json({ message: "Transfer successful" });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        console.error("Transfer error:", err);
        res.status(400).json({ message: err.message || "Transfer failed" });
    }
});

module.exports = router;
