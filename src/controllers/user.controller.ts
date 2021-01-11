import { Request, Response } from "express";
import UserModel, { IUser } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../config/config";


const createToken = (user: IUser): string => {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, config.jwtSecret)
};

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.email || !req.body.password) {
        res.status(400).json({msg: "please provide your email and password"});
    }

    const {email, password} = req.body;

    const user: IUser = await UserModel.findOne({email: email})
    console.log(user)
    if (user) {
        return  res.status(400).json({msg: "User already exists"});
    }

    const newUser = new UserModel(req.body)
    await newUser.save()
    return res.status(201).json(newUser);
}


export const signIn = async (req: Request, res: Response) =>{
    if (!req.body.email || !req.body.password) {
        res.status(400).json({msg: "please provide your email and password"});
    }

    const {email, password} = req.body;

    const user: IUser = await UserModel.findOne({email: email})
    if (!user) {
        return  res.status(400).json({msg: "User not exists"});
    }

    const isMatch: boolean = await user.comparePassword(password)

    if (isMatch) {
        return res.status(200).json({token: createToken(user)})
    }

    return res.status(400).json({
        msg: "The email or password are incorrect"
    })

}   