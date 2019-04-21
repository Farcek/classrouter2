# Classrouter
expressjs based routing system.


``npm install classrouter``


## future ##
---------------------------------------
- Routing
- Param pipe
- Error handle
- Response filter

## get start ##
---------------------------------------

``` typescript
// sample controller
// home.controller.ts

@Controller({
    // name param requared. use  the  param. Swagger json. 
    name: 'home'
})
export class HomeController {
    @Get(path :'/')
    home(){
        return new ViewResponse('home.html', {
            message : 'welcome'
        });
    }

    @Get(path :'/sitemap.xml')
    sitemap(@BodyParam(VaidationPipe()) body:{user:string, pass:string}){
        return new XmlResponse(...);
    }

    @Get(path :'/robots.txt')
    robots(@BodyParam(VaidationPipe()) body:{user:string, pass:string}){
        return new PlanResponse(...);
    }
}
```

 

 ``` typescript
// sample Rest API
// user.controller.ts

@Controller({
    name: 'user',  path: '/user'
})
export class UserController {
    @Get(path :'/')
    list(@QueryParam('limit', IntPipe() ) id:number){
        return [...]
    }

    @Post(path :'/')
    save(@BodyParam(VaidationPipe()) body:{user:string, pass:string}){
        return {success : 'ok'}
    }
}
```


``` typescript
// sample server
// src/server.ts

async function startup() {
    let app = express();
    app.use(morgan('dev'));

    new ClassrouterFactory()
        .setupContainer((container) => {
            // InversifyJS DI container
            container.bind<ILogger>($types.Logger).to(SampleLogger).inSingletonScope();
        })
        .setupController(HomeController)
        .setupController(UserController)

        .setupResonsefilter(new JsonResponseFilter())
        .setupResonsefilter(/*XML, Plan, File, */) // your custom response filters
        
        .build(app);

    app.listen(3000, () => {
        console.log('listen 3000');
    });
}

startup().catch(console.log);
```

## routing

supported HttpMethod.  Get, Post, Put, Push, Delete, Head

supporting route:  

    - MethodRoute 
    - Classrouting

``` typescript
    // routing path:
    // <basePath>/<MainController-path>/<ChildController-path>/<Action-Path>
```

``` typescript
// method route
// call addr : [GET]<basePath>/sample/foo/bar
@Controller({name:'sample', path :'/sample'})
class SampleController {

    @Get({path: '/foo/bar'})
    sampleMethod(){
        return { ... }
    }
}

```

``` typescript
// class route
// call addr : [GET]<basePath>/foo/bar
@Get({path: '/foo/bar', name:'sample'})
class SampleAction {

    
    @Action() // register action method
    doAction(){
        return { ... }
    }
}

@Controller({
    name:'sample',
    actions : [SampleAction] //<- register class action
})
class SampleController {

    /**
     *  classAction with methodAction supported
     */
    @Get({...})
    foo(){ 
        return { ... }
    }

    @Get({...})
    bar(){
        return { ... }
    }
}
```

## param

suporting param types.  Query, Path, Body, Request, Header, Cookie;

```

@Get(filedName?: string | string[], ...pipe: IPipeTransform[])

fieldName empty : All params
fieldName defined : the field name resolved 
```

```typescript
@Get({name : 'sample', path: '/user/edit/:id'})
class SampleAction{

    @PathParam('id') // "id" - path param name
    idStr:string = 0 // default value = 0;

    @PathParam() // not defined param name
    appPathParams : any; // all path params.  {id:string}

    @PathParam('id', IntPipe()) // intPipe is  string to number convert
    idNum:number = '' // default value = '';

    @RequestParam('session')
    session:any;


    @Action()
    doAction(){
        return {
            idStr: this.idStr,
            idNum: this.idNum,
            appPathParams: this.appPathParams,
            sessionName: this.session || this.session.name || 'no name',
        }
    }
}


@Controller({ ... })
class SampleController{

    // call addr : <basePath>/list?limit=10
    @Get({path: '/list'})
    list( @QueryParam('limit', IntPipe()) limit ){
        return [...]
    }

    @Post({path: '/save', before : [JsonbodyParser] })
    Save( 
        @BodyParam('name') name ,
        @RequestParam(new FlashPipe()) flash 
    ){

        try{
            // save process
            ...

            flash.message('save process success');
            return 'success result';
        }
        catch(err:Error){
            flash.message('save process fail.' + err.message );
             return 'fail result';
        }
    }
}
```

## pipe

``` typescript
class IntPipe implements IPipeTransform {
    transform(idStr: string) { 
        return parseInt(idStr); 
    }
}

class ModelPipe implements IPipeTransform {
    constructor (private EntityType: IModel){

    }
    async transform(idNum: number) {
        let entity =  await this.EntityType.findById(idNum);
        if(entity) {
            return entity;
        }
        throw new Error('not found Entity id');
    }
}

```

``` typescript
@QueryParam('id', new IntPipe(), new ModelPipe(UserEntity))

// id string ==> id number ==> UserEntity find by id param
```


## Error handle

``` typescript
// class action error handle

class SampleAction {


    @Action({errorHandle : 'onError'})
    doAction(){
        throw new Error("test error")
    }

    onError(err:any){
        return new ViewResponse('error.html',{
            title : 'Error page',
            error : err
        });
    }

}
```

``` typescript
// method action error handle

class FooError {}
class BaaError {}

@Controller({ name:'sample', errorHandle : 'onError' })
class SampleController {

    @Get({ path: '/', errorHandle : 'sampleError' })
    sample(){
        throw new Error();
    }

    @Get({ })
    foo(){
        throw new FooError();
    }

    @Get({ })
    baa(err:any){
       throw new BaaError();
    }

    // contoller all action Error handle
    onError(err:any){
        return ...
    }

    // only "sample" method action Error handle
    sampleError(err:any){

    }


    // controller all action Error handle. filtering instanceOf FooError
    @ErrorHandle({ instanceOf: FooError })
    fooError(err:any){
        return ...
    }

    // all action handle. filtering function
    @ErrorHandle({ when: (err) => err instanceof BaaError })
    baaError(err:any){
        return ...
    }

}
```

## response filter

```typescript
interface IFilterParam {
    actionResult: any
    expressRes: express.Response
    expressReq: express.Request
    handled: boolean
}

interface IResponseFilter {
    filter(param: IFilterParam): void | Promise<void>
}
```


```typescript
export class RedirectResponse {
    statusCode: number
    constructor(public uri: string, temp: boolean = true) {
        this.statusCode = temp ? 302 : 301
    }
}

export class RedirectResponseFilter implements IResponseFilter {
    filter(params: IFilterParam) {
        let { actionResult, expressRes } = params;
        if (actionResult instanceof RedirectResponse) {
            expressRes.redirect(actionResult.statusCode, actionResult.uri);
            params.handled = true;  // this response filter handled.
        }
    }
}

// use
&Controller( ... )
class SampleController(){

    @Get({path: '/edit/:id'})
    edit(){
        ...

        if( checkId ) {
            return new ViewResponse( ... );
        }else{
            return new RedirectResponse(`/error`, false);
        }
    }
    
    @Post({path:'/save'})
    doSave(){
        ...

        if(isError) {
            return new RedirectResponse(`/edit/${id}`);
        }

        // do save process
        ...
    }
}

// register response filter
// classrouterFactory.setupResonsefilter(new JsonResponseFilter())

```

sample React response
``` typescript
// used by react serverside rendering. 
// using the react side render
export class ReactResponseFilter implements IResponseFilter {
    

    async buildAppContext(req: express.Request): Promise<IAppContext> {
        let flash = null;
        if (req.session) {
            flash = req.session.flash;
            delete req.session.flash;
        }

        return {
            rqPath: req.originalUrl,
            expressReq: req,
            flash,
        }
    }
    async filter(param: IFilterParam) {
        let { actionResult, expressRes, expressReq } = param;

        if (React.isValidElement(actionResult)) {

            let appContext = await this.buildAppContext(expressReq);

            ReactDOM.renderToNodeStream(<AppContext.Provider value={appContext}>{actionResult} </AppContext.Provider>)
                .pipe(expressRes);

            param.handled = true;
        }
    }  
}


@Get( ... )
class SampleAction {

    @Action()
    doAction(@QueryParam('name') name:string ){
        return <div>
            name : {{name}}
        </div>
    }
}



// register response filter
// classrouterFactory.setupResonsefilter(new ReactResponseFilter())

```
