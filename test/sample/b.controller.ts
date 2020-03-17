import { Controller, Get, Post, QueryParam } from "src";


@Controller({
    name: 'b-controller',
    path : '/b'
})
export class bController {

    at = new Date();
    c = 1;

    @Get({ path: '/test' })
    test() {
        return ['bController.test', this.at, this.c ++];
    }

    @Get({ path: '/test2' })
    test2(@QueryParam() q: {}) {
        return { test2: 'bController.ok' }
    }

}