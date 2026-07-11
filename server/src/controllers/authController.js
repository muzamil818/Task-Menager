const bcrypt = require("bcryptjs");
const User = require("../models/User");

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
    return res.status(400).json({
        message: "All fields are required"
    });
}
const existingUser = await User.findOne({ email });
if (existingUser) {
    return res.status(400).json({
        message: "User already exists"
    });
}

    console.log(req.body);

    res.json({
        message: "Data Received",
        data: req.body
    });

};

module.exports = {
    register
};