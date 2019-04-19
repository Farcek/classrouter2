import "reflect-metadata";
import { ClassrouterFactory, JsonResponseFilter, $types, ILogger } from "src";
import { aController } from "./a.controller";
import express from 'express'
import { SampleLogger } from "./logger";


async function startup() {
    let app = express();
    new ClassrouterFactory()
        .setupContainer((container) => {
            container.bind<ILogger>($types.Logger).to(SampleLogger).inSingletonScope();
        })
        .setupController(aController)
        .setupResonsefilter(new JsonResponseFilter())
        .build(app, '/api');

    app.listen(3000, () => {
        console.log('listen 3000');
    });
}

startup().catch(console.log);



// let m = s.toMetajson();


// var fs = require('fs');
// fs.writeFile('myjsonfile.json', JSON.stringify(m, null, 4), 'utf8', (e:any)=>{
//     console.log(e)
// });
