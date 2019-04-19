import 'reflect-metadata';
import { suite, test } from "mocha-typescript";

import { assert } from "chai";
import { http } from './http';

@suite
class ApiMethodMethodAction {
    @test
    async default() {
        let r: any = await http.get('/api/a-controller/list?id3=3');
        assert.deepEqual(r, [1, 2, 3]);

        r = await http.post('/api/a-controller/save', { name: 'farcek' });
        assert.deepEqual(r.save, 'ok');
    }


    @test
    async errorHandle1() {
        let r: any = await http.post('/api/a-controller/save', { name: 'error' });
        assert.deepEqual(r.msg, 'save error');
    }


    @test
    async errorHandle2() {
        let r: any = await http.post('/api/a-controller/test', { name: 'error' });
        assert.deepEqual(r.msg, 'name error');
    }
}