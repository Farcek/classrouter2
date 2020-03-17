import { Controller, Get, Post, QueryParam } from "src";
import { Exception } from "@napp/exception";


@Controller({
    name: 'e-controller',
    path: '/e'
})
export class eController {


    @Get({ path: '/1' })
    test1() {
        throw new Error("e1");
    }

    @Get({ path: '/2' })
    test2() {
        throw new Exception("e2", "e2").setDataValue('ee','e2');
    }

}