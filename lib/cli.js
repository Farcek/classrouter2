#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apidoc_1 = require("./apidoc");
/**
 * Module dependencies.
 */
const program = require('commander');
const pkg = require('../package.json');
program
    .version(pkg.version);
program
    .command('gen-apidoc')
    .description('generate swagger json')
    .action((options) => {
    const conf = require('rc')('classrouter', {
        root: "swagger-json"
    });
    let as = new apidoc_1.ApiDocSwagger();
    console.log(11111111, as.swaggerJson);
});
program
    .parse(process.argv);
//# sourceMappingURL=cli.js.map