import 'reflect-metadata';
import { suite, test, only } from "mocha-typescript";

import { assert } from "chai";
import { http } from './http';

@suite
@only
class ApiMethodClassAction {
    @test
    @only
    async actionclass() {
        let r: any = await http.get('/api/a-controller/a-action?id=4&name=farcek');
        assert.equal(r.n, 'a-action')
        assert.equal(r.id, 8)
        assert.equal(r.name, 'farcek')

    }

    @test
    async actionclassError() {
        let r: any = await http.get('/api/a-controller/a-action?id=0&name=farcek');

        assert.equal(r.txt, 'OnError - ok')
    }

    @test
    async actionclassError1() {
        let r: any = await http.get('/api/a-controller/b-action?id=1&name=error1');
        assert.equal(r.n, 'error1')
        assert.equal(r.err.e, 1)
        assert.equal(r.id, 1)
        assert.equal(r.name, 'error1')
    }
    @test
    async actionclassError2() {
        let r: any = await http.get('/api/a-controller/b-action?id=2&name=error2');

        assert.equal(r.n, 'error2')
        assert.equal(r.err.e, 2)
        assert.equal(r.id, 2)
    }

}