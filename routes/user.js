const express = require("express");
const router = express.Router();
// const authMiddleware = require("../middleware/auth");


const {
    INSERT_USER,
    LOGIN,
    NEW_JWT_TOKEN
} = require("../controllers/user")

router.post("/signUp", INSERT_USER);
router.post("/login", LOGIN);
router.get("/getNewJwtToken", NEW_JWT_TOKEN);

module.exports = router;