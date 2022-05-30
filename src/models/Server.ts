import * as express from 'express';
import cors from 'cors';
import config from '../config/index';
import router from '../routes';

class Server{
    app = express.default();

    constructor(){
        this.database();
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(cors());
        this.app.use(express.json());
    }

    routes(){
        this.app.use('/api', router)
    }

    async database(){

    }

    listen(){
        const PORT = config.PORT || 4000;
        this.app.listen(PORT, () => {
            console.log(`Escuchando en el puerto ${PORT}`)
        })
    }
}

export default Server;