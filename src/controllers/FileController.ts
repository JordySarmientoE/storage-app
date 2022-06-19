import { Request, Response } from "express";
import fileStorage from '../libs/storage';
import client from "../libs/database";

class FileController {

    async getAll(_: Request, res: Response) {
        const users = await client.file.findMany();
        res.json({
            success: true,
            message: 'Listado de archivos',
            data: users
        })
    }

    async uploadFile(req: Request, res: Response) {
        try {
            const files = req.files || [];
            const ownerId = +req.body.id;
            if (!Array.isArray(files)) {
                return res.status(400).json({
                    success: false,
                    message: 'Es necesario al menos un archivo'
                })
            }
            const results = await fileStorage.uploadFiles(files);
            const data = await Promise.allSettled(results.map(async (file: any) => {
                if (file.value.success) {
                    const newFile = await client.file.create({
                        data: {
                            name: file.value.fileName,
                            originalName: file.value.originalName,
                            ownerId
                        }
                    })
                    return newFile;
                }
            }))
            const dataFiltered = data.filter(d => d.status === 'fulfilled') as PromiseFulfilledResult<any>[]
            res.json({
                success: true,
                message: 'Archivos cargados correctamente',
                data: dataFiltered.map(d => d.value)
            })
        }
        catch (err) {
            console.log({ err })
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    }

    async deleteFiles(req: Request, res: Response) {
        try {
            const files = req.body.files || [];
            const ownerId = +req.body.id
            const results = await Promise.allSettled(files.map(async (file: any) => {
                const fileFounded = await client.file.findFirst({
                    where: {
                        name: file,
                        ownerId
                    }
                })
                if (fileFounded) {
                    const result = await fileStorage.deleteFile(file)
                    if (result.success) {
                        const deletedFile = await client.file.delete({
                            where: {
                                id: fileFounded.id
                            }
                        })
                        return deletedFile;
                    }
                }
            }))
            const dataFiltered = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<any>[]
            res.json({
                success: true,
                results: dataFiltered.map(d => d.value)
            })
        }
        catch (err) {
            console.log({ err })
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    }

    async updateFile(req: Request, res: Response) {
        try {
            const ownerId = +req.body.id;
            const newName = req.body.newName;
            const fileName = req.body.fileName;
            const result = await client.file.findFirst({
                where: {
                    name: fileName,
                    ownerId
                }
            })
            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el archivo'
                })
            }
            const updateFile = await client.file.update({
                where: {
                    id: result.id
                },
                data: {
                    originalName: newName
                }
            })
            res.json({
                success: true,
                message: 'Se actualizó el archivo',
                data: updateFile
            })
        }
        catch (error) {
            console.log({ error })
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    }

    async get(req: Request, res: Response){
        try{
            const file = await client.file.findFirst({
                where: {
                    name: req.params.fileName
                }
            })
    
            if(!file){
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró archivo'
                })
            }
            const result = await fileStorage.downloadFile(req.params.fileName, res) as any;
            if(!result.success){
                return res.status(500).json({
                    success: false,
                    message: 'Ha ocurrido un error'
                })
            }

            return res.end()
        }
        catch(error){
            console.log({ error })
            res.status(500).json({
                success: false,
                message: 'Ha ocurrido un error'
            })
        }
    }
}

export default new FileController()