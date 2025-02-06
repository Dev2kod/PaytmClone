const express = require('express');
const { User, Account } = require('../schema/db');
const zod = require('zod');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
        users: user.map(user=>({
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
        username: body.username,
        password: body.password,
        firstname: body.firstname,
        lastname: body.lastname,
    });

    // Create account with initial balance
    await Account.create({
        userid: user._id,
        balance: Math.floor(1 + Math.random() * 10000),
    });

    // Generate JWT
    const token = jwt.sign({ userid: user._id }, process.env.JWT);

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
        process.env.JWT);
        res.status(201).json({
        token: token
    })}
    if(!data){
        res.status(400).json({msg:"User not found in DB"})
    }});

module.exports = router
