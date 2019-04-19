import { Controller, Get, Post, BodyParam, QueryParam, ErrorHandle } from "src";
import { bController } from "./b.controller";
import { aAction } from "./a.action";
import { bAction } from "./b.action";


@Controller({
    name: 'a-controller', path: '/a-controller',
    controllers: [bController],
    actions: [aAction, bAction],
})
export class aController {

    @Get({ path: '/list' })
    list(@QueryParam('filter') filter: string) {
        return [1, 2];
    }

    @Post({ path: '/save', errorHandle : 'saveError' })
    save( @BodyParam() body: any) {
        return { save: 'ok' }
    }

    saveError(err:Error ){

    }

    @ErrorHandle(Error)
    onError22() {
        return {
            n: 'error22',
        }
    }
}