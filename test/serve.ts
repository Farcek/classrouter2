// process.env.DEBUG = 'express:*'
import "reflect-metadata";
import * as express from 'express';
import { ClassrouterFactory } from '../src/factory';
import { defaultFilters } from '../src/responses';
import { MainController } from './main.controller';


async function boostrap() {
    const app = express();

    //app.en

    const classrouter = new ClassrouterFactory({
        app: app,
        controllerTypes: [MainController],
        responseFilters: [...defaultFilters]
    });

    await classrouter.initlize();

    app.listen(3000, () => {
        console.log('app started')
    });
}

boostrap();


