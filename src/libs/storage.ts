import { Storage } from '@google-cloud/storage';
import config from '../config/index';
import { v4 } from 'uuid';
import path from 'path';
import { Readable } from 'stream';
import { Response } from 'express';

const storage = new Storage({
    keyFilename: "credentials.json"
})

const uploadFile = (file: any) => {

    if (!file) {
        return {
            success: false,
            message: 'At least one file is required'
        }
    }

    const ext = path.extname(file.originalname);
    const fileName = v4() + ext;
    const cloudFile = storage.bucket(config.BUCKET_NAME || '').file(fileName);
    const fileStream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
        fileStream.pipe(cloudFile.createWriteStream())
            .on("finish", () => {
                resolve({
                    success: true,
                    message: 'File uploaded successfully',
                    originalName: file.originalname,
                    fileName
                })
            })
            .on("error", (_) => {
                reject({
                    success: false,
                    message: 'An error ocurred'
                });
            })
    })
}

const uploadFiles = async (files: any[] = []) => {
    const promises = files.map(file => uploadFile(file))
    const results = await Promise.allSettled(promises)
    return results;
}

const deleteFile = async(fileName: string) => {
    try{
        const file = storage.bucket(config.BUCKET_NAME || '').file(fileName);
        await file.delete() as any;
        return {
            success: true,
            fileName
        };
    }
    catch(error){
        console.log(error)
        return {
            success: false,
            message: 'Ocurrio un error'
        }
    }
}

const downloadFile = async(fileName: string, res: Response) => {
    const file = storage.bucket(config.BUCKET_NAME || '').file(fileName);
    const stream = file.createReadStream();

    return new Promise((resolve, reject) => {
        stream.on("error",(error) => {
            console.log(error)
            reject({
                error,
                success: false
            })
        })

        stream.pipe(res)

        stream.on("end", () => {
            resolve({
                success: true,
                message: 'Download success'
            })
        })
    })
}

export default {
    uploadFile,
    uploadFiles,
    deleteFile,
    downloadFile
}