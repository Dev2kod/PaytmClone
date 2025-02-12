const zod = require('zod'); 
const jwt = require('jsonwebtoken');
const express = require("express");
const dblink = require("./dblink");
require('dotenv').config();
const mainRouter = require('./routes/index');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
dblink();

// Root Route
app.use("/api/v1", mainRouter);

// Start Server
app.listen(process.env.PORT || 3000, () => {
    console.log("App running at port", process.env.PORT || 3000);
});
