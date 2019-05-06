
import { Classtype, OController, IResponseFilter } from "./interface";
import { Rootmeta } from "./metadata";
import * as express from "express";
import { Container } from "inversify";
import { Builder } from "./builder";
import { Lanchar } from "./lanchar";


export interface PClassrouterFactory {
    basePath?: string;
    bind: (container: Container) => void;

    controllers: Classtype[];
    responseFilters: {
        default: IResponseFilter,
        filters?: IResponseFilter[]
    }
}
export class ClassrouterFactory {

    private _basePath?: string;
    private root = new Rootmeta();
    private container = new Container();
    private lanchar = new Lanchar(this.container);


    constructor(options: PClassrouterFactory) {
        this._basePath = options.basePath;
        options.bind(this.container);
        for (let c of options.controllers) {
            this.root.registerController(c, '');
        }
        this.lanchar.defaultResponse = options.responseFilters.default;
        if (options.responseFilters.filters) {
            for (let f of options.responseFilters.filters) {
                this.lanchar.responseFilters.push(f);
            }
        }


    }

    get basePath() {
        return this._basePath;
    }

    get rootMetada() {
        return this.root;
    }


    build(app: express.Application) {
        let build = new Builder(this.lanchar);

        if (this.basePath) {
            let route = express.Router();

            build.buildRoot(route, this.root);
            app.use(this.basePath, route);
        } else {
            build.buildRoot(app, this.root);
        }

        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.log('error', err)
            this.lanchar.response(err, req, res);
        });

        return this.root;
    }

    toMetajson() {
        return this.root.toMetajson();
    }



}