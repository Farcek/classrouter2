
import { Classtype, OController, IResponseFilter, ILogger, IRouterBuilder, IExpressRequest, IExpressResponse, IExpressNext, IErrorParser } from "./interface";
import { Rootmeta } from "./metadata";
import { Builder } from "./builder";
import { Lanchar } from "./lanchar";
import { ExceptionConvert, Exception } from "@napp/exception";


export interface PClassrouterFactory {
    basePath?: string;
    controllers: Classtype[];

    logger: ILogger;
    routerBuilder: IRouterBuilder;
    errorParser?: IErrorParser;
    responseFilters: {
        default: IResponseFilter,
        filters?: IResponseFilter[]
    }
}
export class ClassrouterFactory {

    private _basePath?: string;
    private root = new Rootmeta();
    private lanchar: Lanchar;
    private logger: ILogger;
    errorParser: IErrorParser;
    private routerBuild: IRouterBuilder;


    constructor(options: PClassrouterFactory) {
        this.logger = options.logger;
        this.routerBuild = options.routerBuilder;
        this.errorParser = options.errorParser || ((err: any) => ExceptionConvert(err))


        this._basePath = options.basePath;



        this.lanchar = new Lanchar(this.logger, this.errorParser);

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


    build(app: any) {
        let build = new Builder(this.lanchar, this.logger, this.routerBuild);

        if (this.basePath) {
            let route = this.routerBuild();

            build.buildRoot(route, this.root);
            app.use(this.basePath, route);
        } else {
            build.buildRoot(app, this.root);
        }

        app.use((err: any, req: IExpressRequest, res: IExpressResponse, next: IExpressNext) => {
            let error = this.errorParser(err)
            this.logger('error', error.message, error.toNameData())

            this.lanchar.response(error, req, res)
                .catch(err => next(err))
        });

        return this.root;
    }

    toMetajson() {
        return this.root.toMetajson();
    }



}