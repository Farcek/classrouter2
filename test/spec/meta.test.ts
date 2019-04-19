import 'reflect-metadata';
import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { Get, ActionClassMeta, Action, HttpMethod, Controller, ActionMethodMeta, ControllerMeta } from "src";

@Get({ path: 'pa', name: "A", errorHandle: 'E1' })
class A {

    @Action({errorHandle : 'onError'})
    action() {

    }

    onError(err: any) {

    }
}

@Controller({
    name: 'a',
    actions: [A],
    befores: [() => (q, s, n) => n()]
})
class AController {

    @Get({ path : '/list', name : 'test-list',  errorHandle : 'OnListError' })
    list(){
        return 11
    }

    OnListError(err:any){

    }
}
@suite
class Medadata {
    @test
    actionclassMeta() {
        let d = new ActionClassMeta(A, 'test');

        assert.isArray(d.path, 'class action path array')
        assert.lengthOf(d.path, 1, 'class action path array leng')
        assert.equal(d.path[0], 'pa', 'class action path value')
        assert.equal(d.localname, 'A', 'class action localname')
        assert.equal(d.fullname, 'test.A', 'class action fullname')
        assert.equal(d.httpMethod, HttpMethod.Get, 'class action httpmethod')
        assert.equal(d.Actionclass, A, 'class action class ref')
        assert.equal(d.errorHandle1, 'onError', 'class action error handle 1')
        assert.equal(d.errorHandle2, 'E1', 'class action error handle 2')

    }

    @test
    controllerMeta() {
        let d = new ControllerMeta(AController, 'test');
        assert.equal(d.Controllerclass, AController)
        assert.equal(d.befores.length, 1)
        assert.equal(d.classActions.A.Actionclass, A)
        assert.equal(d.path, undefined)
    }

    @test
    actionMethod() {
        let c = new ControllerMeta(AController, 'test');

        let mActions = Object.keys(c.methodActions);

        assert.equal(mActions.length, 1);

        let mName = mActions[0];

        assert.instanceOf(c.methodActions[mName], ActionMethodMeta);

        let d:ActionMethodMeta = c.methodActions[mName];
       
        assert.equal(d.localname, 'test-list')
        assert.equal(d.fullname, 'test.a.test-list')
        assert.equal(d.errorHandle, 'OnListError')
        assert.deepEqual(d.path, ['/list'])
    }
}