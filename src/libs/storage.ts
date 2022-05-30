import { Storage } from '@google-cloud/storage';
import config from '../config/index';
import { v4 } from 'uuid';
import path from 'path';
import { Readable } from 'stream';

const storage = new Storage({
    keyFilename: "credentials.json"
})

const uploadFiles = (files: any[]) => {
    files.forEach(file => {
        const ext = path.extname(file.originalname);
        const fileName = v4() + ext;
        const cloudFile = storage.bucket(config.BUCKET_NAME || '').file(fileName);
        const fileStream = Readable.from(file.buffer);
        fileStream.pipe(cloudFile.createWriteStream())
            .on("finish", () => {
                console.log("Upload finish...")
            })
            .on("error", (err) => {
                console.log(err)
            })
    })
}

export default uploadFiles