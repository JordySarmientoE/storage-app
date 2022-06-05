import { Request, Response } from "express";
import upload from '../libs/storage';
import client from "../libs/database";

class FileController {
    async uploadFile(req: Request, res: Response) {
        const files = req.files || [];
        if (!Array.isArray(files)) {
            return res.json({
                success: false,
                message: 'At least one file is required'
            })
        }
        const results = await upload.uploadFiles(files);
        await Promise.allSettled(results.map(async (file: any) => {
            if (file.value.success) {
                await client.file.create({
                    data: {
                        name: file.value.fileName,
                        originalName: file.value.originalName,
                        ownerId: 1
                    }
                })
            }
        }))
        return res.json({
            success: true,
            message: 'Upload successfull'
        })
    }
}

export default new FileController()