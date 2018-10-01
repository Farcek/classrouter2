#!/usr/bin/env node

import { ApiDocSwagger } from "./apidoc";

/**
 * Module dependencies.
 */

const program = require('commander');
const pkg: { version: string } = require('../package.json');

program
    .version(pkg.version);

interface IConfic {
    /**
     * swagger json generate root dir
     */
    root: string;
}
program
    .command('gen-apidoc')
    .description('generate swagger json')
    .action((options: any) => {

        const conf = require('rc')('classrouter', {
            root: "swagger-json"
        });

        let as = new ApiDocSwagger();
        console.log(11111111, as.swaggerJson)
    })
    ;





program
    .parse(process.argv);


export {

}