import 'reflect-metadata';
import { suite, test, only } from "mocha-typescript";

import { assert } from "chai";
import { http } from './http';

@suite
class ErrorMethodAction {
    @test
    async e1() {
        {
            let r: any = await http.get('/api/e/1');
        assert.equal(r.message, 'e1')
        }

        {
            let r: any = await http.get('/api/e/2');            
            assert.equal(r.message, 'e2')
            assert.equal(r.data.ee, 'e2')
        }
    }
    
}