import { Controller, Get, Post, QueryParam } from "../src";
import { get } from "https";


@Controller({
    name: 'b-controller',
})
export class bController {

    @Get({ path: '/test' })
    test() {
        return ['bController.test'];
    }

    @Get({ path: '/test2' })
    test2(@QueryParam() q: {}) {
        return { test2: 'bController.ok' }
    }

}