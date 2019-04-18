import { Classtype, OController, IResponseFilter } from "./interface";
import { Rootmeta } from "./metadata";
import express from "express";
import { Builder } from "./builder";
import { Lanchar } from "./lanchar";

export class ClassrouterFactory {


    private root = new Rootmeta();
    private lanchar = new Lanchar();
    constructor() {

    }

    setupController(...controller: Classtype[]) {
        for (let c of controller) {
            this.root.registerController(c, '');
        }
        return this;
    }

    setupDefaultResponseFilter(filter: IResponseFilter) {
        this.lanchar.defaultResponse = filter;
        return this;
    }
    setupResonsefilter(...filter: IResponseFilter[]) {

        for (let f of filter) {
            this.lanchar.responseFilters.push(f);
        }
        return this;
    }




    build(app: express.Application, basepath?: string) {
        let build = new Builder(this.lanchar);

        if (basepath) {
            let route = express.Router();

            build.buildRoot(route, this.root, [basepath]);
            app.use(basepath, route);
        } else {
            build.buildRoot(app, this.root, []);
        }

        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.lanchar.response(err, req, res, next);
        });
    }

    toMetajson() {
        return this.root.toMetajson();
    }

}