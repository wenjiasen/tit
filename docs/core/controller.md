# Controller

`Tit`框架将代码逻辑简单的分成`Controller`和`Server`两个抽象逻辑

Controller 主要负责声明路由、参数检查、返回值包装等工作。

Server 主要负责实际的业务逻辑处理，例如数据库操作等。[详情](./server)

## 定义一个 Controller

框架默认会加载`src/controller`中的所有文件。

框架提供了`TitController`基类，所有的自定义 Controller 类都需要继承此类。并且需要使用`@Controller`装饰器定义。

一个简单的示例：

```javascript
import { TitController, Controller} from 'tit';

@Controller({
  prefix: '/api',
})
export class IndexController extends TitController {
    @Router({
        path: '/hello',
        method: HttpMethod.GET,
    })
    public async helloWord(): Promise<void> {
        const { ctx, app } = this;
        ctx.body = {
            message: 'Hello World!'
        }
    }
}

```

## TitController 提供的功能

`TitController`内部修改了每次每次调用类方法时的`this`对象，`this`是一个包含了`ctx`和`app`属性的一个对象。

例如上例中的`const { ctx, app } = this;`，这里的`ctx`是 `koa` 中的`context`，`app`是全局的`Application`实例。
