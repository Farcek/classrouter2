import "reflect-metadata";
import { ClassrouterFactory, JsonResponseFilter } from "src";
import { aController } from "./a.controller";
import  express from 'express'


async function startup(){
    let app =  express();
    new ClassrouterFactory()
        .setupContainer((container)=>{
            
        })
        .setupController(aController)
        .setupResonsefilter(new JsonResponseFilter())
        .build(app, '/api');

    app.listen(3000,()=>{
        console.log('listen 3000');
    });
}

startup().catch(console.log);



// let m = s.toMetajson();


// var fs = require('fs');
// fs.writeFile('myjsonfile.json', JSON.stringify(m, null, 4), 'utf8', (e:any)=>{
//     console.log(e)
// });
