const express = require('express');
const { User, Account } = require('../db');
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require('../middleware');

const router = express.Router();

// Validation Schema
const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string(),
});
const signinSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
})


router.get('/fetch',async(req,res)=>{
    const data= await User.find()
    res.json(data);

})

router.get("/bulk",async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or:[{
             firstname: {
                $regex: filter
            }},
        {
            lastname: {
            $regex: filter
            }    
        }]
    })
    res.json({
        users: users.map(user=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        })) 
    })
})

// Signup Route
router.post('/signup', async (req, res) => {
    const body = req.body;

    // Validate input
    const { success, error } = signupSchema.safeParse(body);
    if (!success) { 
        return res.status(400).json({
            msg: "Invalid input",
            error: error.errors,
        });
    }

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }
    // Create new user
    const user = await User.create({
        firstname: body.firstname,
        lastname: body.lastname,
        username: body.username,
        password: body.password,
        });

    const token = jwt.sign({ userid: user._id }, JWT_SECRET);

    // Create account with initial balance
    await Account.create({
        userid: user._id,
        balance: Math.floor(1 + Math.random() * 10000),
    });

    // Generate JWT

    res.status(201).json({
        msg: "User created",
        token: token,
    });
});

router.post('/signin',async (req,res) => {
    const body = req.body;
 const info = signinSchema.safeParse(body);
 if(!info){
    res.json({msg:"invlalid Credentials"})
 }
 const data = await User.findOne({username: body.username});
    if(data){
    const token = jwt.sign(
        { userid: data._id },
        JWT_SECRET)
        res.status(201).json({
        token: token
    })}
    if(!data){
        res.status(400).json({msg:"User not found in DB"})
    }});

    router.get("/verify",authMiddleware,(req,res)=>{
        console.log("verified");
        res.json({
            msg: "user Verified",
        })
    })

    router.delete('/delUser', async (req, res) => {
        try {
            const { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ error: 'User ID is required' });
            }
    
            const {success} = await User.findByIdAndDelete(id);
            if (!success) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully', user });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
        
    router.post("/account/transfer", authMiddleware, async (req, res) => {
        try {
            const { to, amount } = req.body;
            const fromUserId = req.user.userid; // Extract sender from token
    
            if (!to || !amount || amount <= 0) {
                return res.status(400).json({ message: "Invalid transfer request" });
            }
    
            // Fetch sender and receiver accounts
            const senderAccount = await Account.findOne({ userid: fromUserId });
            const receiverAccount = await Account.findOne({ userid: to });
    
            if (!senderAccount || !receiverAccount) {
                return res.status(404).json({ message: "User account not found" });
            }
    
            if (senderAccount.balance < amount) {
                return res.status(400).json({ message: "Insufficient balance" });
            }
    
            // Update balances
            senderAccount.balance -= amount;
            receiverAccount.balance += amount;
    
            await senderAccount.save();
            await receiverAccount.save();
    
            res.json({ message: "Transfer successful", balance: senderAccount.balance });
        } catch (error) {
            console.error("Transfer Error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
    
module.exports = router