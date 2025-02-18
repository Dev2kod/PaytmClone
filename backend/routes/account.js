const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {
    try {
        const account = await Account.findOne({ userid: req.userid })
        console.log("Requesting user ID:", req.userid);
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json(account);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;
        const fromAccount = await Account.findOne({ userid: req.userid }).session(session)

        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userid: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        // Perform the transfer
        await Account.updateOne({ userid: req.userid }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userid: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Transfer successful" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed" });
    } finally {
        session.endSession();
    }
});

module.exports = router;
