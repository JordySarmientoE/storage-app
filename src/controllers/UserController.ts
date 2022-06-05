import { Request, Response } from "express";
import User from "../interfaces/User";
import client from "../libs/database";

class UserController {
    async getAll(_: Request, res: Response) {
        const users = await client.user.findMany();
        res.json({
            success: true,
            message: 'Listado de usuarios',
            data: users
        })
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body as User;
            const user = await client.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: body.password,
                    active: true
                }
            })
            res.json({
                success: true,
                data: user,
                message: 'Se registro usuario'
            })
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    }
}

export default new UserController()