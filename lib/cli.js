#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('pkginfo')(module, "version");
var debug = require('debug')('classrouter:cli:info');
/**
 * Module dependencies.
 */
const apidoc_1 = require("./apidoc");
const path = require("path");
const fs = require("fs");
const mkdirp = require('mkdirp');
const program = require('commander');
program
    .version(module.exports.version || "0");
program
    .command('gen-apidoc <controller>')
    .description('generate swagger json')
    .action((controller) => {
    const conf = require('rc')('classrouter', {
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
    let as = new apidoc_1.ApiDocSwagger();
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
});
program
    .parse(process.argv);
//# sourceMappingURL=cli.js.map