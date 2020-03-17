import "reflect-metadata";
import express from 'express'


import { ClassrouterFactory, JsonResponseFilter } from "src";
import { aController } from "./a.controller";
import { eController } from "./e.controller";


async function startup() {
    let app = express();
    let factory = new ClassrouterFactory({
        basePath: '/api',
        logger: (l: string, m: string, o: any) => console.log('eeeLog ::',l, m, o),
        routerBuilder: () => express.Router(),
        controllers: [aController, eController],
        responseFilters: {
            default: new JsonResponseFilter(),
            filters: [/*XML, Plan, File, */] // your custom response filters
        }
    });

    factory.build(app);

    app.listen(3000, () => {
        console.log('listen 3000');
    });
}

startup().catch(console.log);
