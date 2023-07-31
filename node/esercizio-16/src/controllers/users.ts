import * as dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import { db } from "../db";
import jwt from "jsonwebtoken"
import { access } from "fs";

const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    const user = await db.one(`SELECT * FROM users WHERE username=$1`, username)

    if (user && user.password === password) {

        const payload = {
            id: user.id,
            username,
        }

        const { SECRET = ""} = process.env
        const token = jwt.sign(payload, SECRET)

        await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token])
        res.status(200).json({ id: user.id, username, token})
    } else {
        res.status(400).json({msg: "username or password incorrect"})
    }
}

const signUp = async (req: Request, res: Response) => {
    const {username, password} = req.body
    const user = await db.oneOrNone(`SELECT * FROM users WHERE username=$1`, username);

    if(user) {
        res.status(400).json({ msg: "l'utente esiste già"})
    } else {
        const { id } = await db.one(
            `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
            [ username, password ]);
        res.status(201).json({ msg: "signup successful. Now you can log in"})
    }
}

export { login, signUp }
