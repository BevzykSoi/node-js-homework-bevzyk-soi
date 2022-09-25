const { User } = require("../models");
const jwt = require("../utils/jwt");

exports.register = async (req, res, next) => {
    try {
        const { email, password, subscription } = req.body;

        const existingUser = await User.findOne({
            email,
        });

        if (existingUser) {
            res.status(409).send("Email in use!");
            return;
        }

        const hashedPassword = await User.hashPassword(password);

        const user = await User.create({
            email,
            password: hashedPassword,
            subscription,
        });

        const newToken = jwt.generate(user.id);
        user.token = newToken;
        await user.save();

        res.status(201).json({
            "user": {
                "id": user.id,
                "email": user.email,
                "subscription": user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email,
        });

        if (!user) {
            res.status(401).send("Email or password is wrong!");
            return;
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            res.status(401).send("Email or password is wrong!");
            return;
        }

        const token = jwt.generate(user.id);

        user.token = token;
        await user.save();

        res.json({
            "token": user.token,
            "user": {
                "id": user.id,
                "email": user.email,
                "subscription": user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).send("Not authorized!");
        }

        req.user.token = null;
        await req.user.save();

        res.status(204).send("You've been logged out succesully!");
    } catch (error) {
        next(error);
    }
}

exports.current = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).send("Not authorized!");
        }
        
        console.log(req.user);

        res.json({
            "id": req.user.id,
            "email": req.user.email,
            "subscription": req.user.subscription,
        });
    } catch (error) {
        next(error);
    }
}

exports.updateSubscription = async (req, res, next) => {
    try {
        const { subscription } = req.body;

        const user = await User.findByIdAndUpdate(req.user.id, {
            subscription,
        }, {
            new: true,
        });

        if (!user) {
            res.status(404).send("User not found!");
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
}