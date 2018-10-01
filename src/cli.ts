#!/usr/bin/env node
require('pkginfo')(module, "version");
var debug = require('debug')('classrouter:cli:info');

/**
 * Module dependencies.
 */
import { ApiDocSwagger } from "./apidoc";
import * as path from "path";
import * as fs from "fs";


const mkdirp = require('mkdirp');


const program = require('commander');
program
    .version(module.exports.version || "0");

interface IConfic {
    /**
     * swagger json generate root dir
     */
    root: string;
}
program
    .command('gen-apidoc <controller>')
    .description('generate swagger json')
    .action((controller: any) => {

        const conf: { root: string } = require('rc')('classrouter', {
            root: "apidoc-root"
        });
        const cwd = process.cwd();

        const rootDir = path.resolve(cwd, conf.root);

        let file = path.resolve(cwd, controller);

        debug("loading controller :", file);
        debug("apidoc root :", rootDir);
        require(file);

        mkdirp.sync(rootDir);

        console.time("generated time");

        let as = new ApiDocSwagger();

        let lastAt = path.resolve(rootDir, "last.json");
        let nowAt = path.resolve(rootDir, `${Date.now()}.json`);
        debug("last file :", lastAt);
        debug("now file :", nowAt);

        let json = JSON.stringify(as.swaggerJson);


        fs.writeFileSync(lastAt, json, {
            encoding: 'utf8'
        });

        console.info("generated last at: %s", lastAt);

        fs.writeFileSync(nowAt, json, {
            encoding: 'utf8'
        });

        console.info("generated now at: %s", nowAt);
        console.timeEnd("generated time");
        //console.log(11111111, as.swaggerJson);

    })
    ;





program
    .parse(process.argv);


export {

}