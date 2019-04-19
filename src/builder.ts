import * as express from 'express'
import { Rootmeta, ControllerMeta, ActionClassMeta, ActionMethodMeta } from './metadata';
import { HttpMethod, $types } from './common';
import { IMiddleware, IMiddlewareFactory, ILogger } from './interface';
import { Lanchar } from './lanchar';

export class Builder {
    constructor(private lanchar: Lanchar) {

    }
    buildRoot(router: express.Router, meta: Rootmeta, paths: string[]) {
        for (let cName of Object.keys(meta.controllers)) {
            let cMeta = meta.controllers[cName];
            this.builderController(router, cMeta, paths);
        }
    }
    builderController(parent: express.Router, meta: ControllerMeta, paths: string[]) {
        let router = express.Router();
        this.lanchar.container.bind(meta.Controllerclass).toSelf().inSingletonScope();
        for (let cName of Object.keys(meta.controllers)) {
            let cMeta = meta.controllers[cName];
            this.builderController(router, cMeta, [...paths, meta.path || '']);
        }

        for (let aName of Object.keys(meta.classActions)) {
            let aMeta = meta.classActions[aName];
            this.lanchar.container.bind(aMeta.Actionclass).toSelf();
            this.builderActionclass(router, aMeta, [...paths, meta.path || '']);
        }

        for (let mName of Object.keys(meta.methodActions)) {
            let mMeta = meta.methodActions[mName];
            this.builderActionmethod(router, mMeta, [...paths, meta.path || '']);
        }



        let befores = this.factoryBefores(meta.befores)

        meta.path ? parent.use(meta.path, befores, router) : parent.use(befores, router);
    }

    factoryBefores(befores: IMiddlewareFactory[]) {
        return befores.map(factory => factory())
    }

    builderActionclass(router: express.Router, meta: ActionClassMeta, paths: string[]) {
        let logger: ILogger = this.lanchar.container.get($types.Logger);
        logger.verbose(`${meta.fullname} ${[...paths, meta.path].join('')} [${HttpMethod[meta.httpMethod]}, class-action]`, { fullname: meta.fullname });
        setupMiddleware(router, meta.path, meta.httpMethod, this.factoryBefores(meta.befores), (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.lanchar.classaction(meta, req, res, next).catch(next);
        });
    }

    builderActionmethod(router: express.Router, meta: ActionMethodMeta, paths: string[]) {        
        let logger: ILogger = this.lanchar.container.get($types.Logger);
        logger.verbose(`${meta.fullname} ${[...paths, meta.path].join('')} [${HttpMethod[meta.httpMethod]}, method-action]`, { fullname: meta.fullname });
        setupMiddleware(router, meta.path, meta.httpMethod, this.factoryBefores(meta.befores), (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.lanchar.methodaction(meta, req, res, next).catch(next);
        });
    }

}


function setupMiddleware(router: express.Router, path: string[], method: HttpMethod, befores: IMiddleware[], action: IMiddleware) {
    if (Array.isArray(path) && path.length) {
        if (method === HttpMethod.Get) {
            router.get(path, befores, action);
        } else if (method === HttpMethod.Post) {
            router.post(path, befores, action);
        } else if (method === HttpMethod.Delete) {
            router.delete(path, befores, action);
        } else if (method === HttpMethod.Put) {
            router.put(path, befores, action);
        } else if (method === HttpMethod.Head) {
            router.head(path, befores, action);
        }
    } else {
        router.use(befores, action);
    }
}
