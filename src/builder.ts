
import { Rootmeta, ControllerMeta, ActionClassMeta, ActionMethodMeta } from './metadata';
import { HttpMethod, $types } from './common';
import { IMiddleware, IMiddlewareFactory, ILogger, IExpressRouter, IRouterBuilder, IExpressRequest, IExpressResponse, IExpressNext } from './interface';
import { Lanchar } from './lanchar';

export class Builder {
    constructor(
        private lanchar: Lanchar,
        private logger: ILogger,
        private routerBuilder: IRouterBuilder,
    ) {

    }
    buildRoot(router: IExpressRouter, meta: Rootmeta) {
        for (let cName of Object.keys(meta.controllers)) {
            let cMeta = meta.controllers[cName];
            this.builderController(router, cMeta);
        }
    }
    builderController(parent: IExpressRouter, meta: ControllerMeta) {
        let router = this.routerBuilder();

        for (let cName of Object.keys(meta.controllers)) {
            let cMeta = meta.controllers[cName];
            this.builderController(router, cMeta);
        }

        for (let aName of Object.keys(meta.classActions)) {
            let aMeta = meta.classActions[aName];

            this.builderActionclass(router, aMeta);
        }

        for (let mName of Object.keys(meta.methodActions)) {
            let mMeta = meta.methodActions[mName];
            this.builderActionmethod(router, mMeta);
        }

        let befores = this.factoryBefores(meta.befores)
        meta.path ? parent.use(meta.path, befores, router) : parent.use(befores, router);
    }

    factoryBefores(befores: IMiddlewareFactory[]) {
        return befores.map(factory => {
            // console.log('before factory', factory)
            return factory();
        })
    }

    builderActionclass(router: IExpressRouter, meta: ActionClassMeta) {
        this.logger('verbose', `${HttpMethod[meta.httpMethod]} class: ${meta.fullname}`, { path: meta.fullpaths });
        setupMiddleware(router, meta.path, meta.httpMethod, this.factoryBefores(meta.befores), (req: IExpressRequest, res: IExpressResponse, next: IExpressNext) => {
            this.lanchar.classaction(meta, req, res, next).catch(next);
        });
    }

    builderActionmethod(router: IExpressRouter, meta: ActionMethodMeta) {
        this.logger('verbose', `${HttpMethod[meta.httpMethod]} method: ${meta.fullname}`, { paths: meta.fullpaths });
        setupMiddleware(router, meta.path, meta.httpMethod, this.factoryBefores(meta.befores), (req: IExpressRequest, res: IExpressResponse, next: IExpressNext) => {
            this.lanchar.methodaction(meta, req, res, next).catch(next);
        });
    }

}


function setupMiddleware(router: IExpressRouter, path: string[], method: HttpMethod, befores: IMiddleware[], action: IMiddleware) {
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
