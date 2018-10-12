import { Controller } from '../src/controllers';
import { UserController } from './user/user.controller';
import { LoginController } from './login/login.controller';
import { ApiController } from './api/api.controller';
import { apiInfo, apiServers, apiMainController, apiSecurityDefine } from '../src';


@Controller({
    controllers: [ApiController]
})

@apiInfo({
    title: "test api",
    version: "1.2.3",
    description: `dads asdf asdf asdf asdf asdf`
})
@apiServers([{
    url: "https://local1",
    description: "local"
}, {
    url: "http://local",
    description: "prod"
}])
@apiMainController()
@apiSecurityDefine("auth1", "basic")
@apiSecurityDefine("auth2", "bearer")
export class MainController {

}