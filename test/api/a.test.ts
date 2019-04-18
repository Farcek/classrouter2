import 'reflect-metadata';
import { suite, test } from "mocha-typescript";

import { assert } from "chai";
import { Get, ActionClassMeta, Action, HttpMethod, Controller, ActionMethodMeta, ControllerMeta } from "src";
import { http } from './http';

@suite
class ApiMethod {
    @test
    async actionclassMeta() {
        let r: any = await http.get('/api/a-controller/a-action?id=1&name=farcek');

        assert.equal(r.n, 'a-action')
        assert.equal(r.id, 1)
        assert.equal(r.name, 'farcek')

    }


}