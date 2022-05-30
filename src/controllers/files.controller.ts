import { Request, Response } from "express";
import uploadFiles from '../libs/storage';

class FileController {
    uploadFile(req: Request, res: Response){
        const files = req.files || [];
        if(!Array.isArray(files)){
            return res.json({
                success: false,
                message: 'At least one file is required'
            })
        }
        uploadFiles(files)
        return res.json({
            success: true,
            message: 'Upload successfull'
        })
    }
}

export default FileController