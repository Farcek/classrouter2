process.env.DEBUG = 'express:*'
import "reflect-metadata";
import * as express from 'express';
import { ClassrouterFactory } from '../src/factory';
import { defaultFilters } from '../src/responses';
import { MainController } from './main.controller';
import { ApiDocSwagger } from "../src";

const swaggerUi = require('swagger-ui-express');
var options = {
    swaggerUrl: '/api.json'
}

async function boostrap() {
    const app = express();

    const classrouter = new ClassrouterFactory({
        app: app,
        basepath: "/v1",
        controllerTypes: [MainController],
        responseFilters: [...defaultFilters]
    });

    await classrouter.initlize();

    app.get("/api.json", new ApiDocSwagger(MainController).action());

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, options));

    app.listen(3000, () => {
        console.log('app started')
    });
}

boostrap();


