# 路由

Tit 框架默认包含了[koa-router](https://github.com/ZijianHe/koa-router)，并且在构造创建一个 koa-router 实例`rootRouter`。

> 注意构造`Application`时不会自动把`rootRouter`加入到 middleware 调用链中，需要自己手动调用。例如：

```javascript
// ...
const app = await ApplicationFactory.create();
app.use(app.rootRouter());
app.listen();
// ...
```

## 装饰器 @Router

Tit 提供了`@Router`用于注册路由，使用此装饰器的注册的路由会被注册到`rootRouter`中。

### 定义一个路由

以下代码定义了一个`/hello`的路由,通过此示例可以了解如何使用路由

```javascript
import { TitController, Controller, Router, HttpMethod } from 'tit';

@Controller({})
export class IndexController extends TitController {
  @Router({
    method: HttpMethod.GET,
    path: '/hello',
  })
  public async getList(): Promise<void> {
    const { ctx } = this;
    ctx.body = 'Hello World';
  }
}
```

### 可选参数

可以通过传入不通的参数控制`@Router`的行为。

#### method

必填，设置此路由可以通过何种`HTTP Method`进行调用.
框架内部提供了`HttpMethod`枚举。
示例：

```javascript
@Router({
    method: HttpMethod.GET
})
```

#### path

必填，设置此路由的路径，路径规则与[koa-router](https://github.com/ZijianHe/koa-router)保持完全一致。具体规则查看[path-to-regexp](https://github.com/pillarjs/path-to-regexp)
示例：

```javascript
@Router({
    path: '/hello'
})
```

#### middleware

可选，类型为`Array<Middleware>`。框架会将此处定义的`middleware`放置在路由处理函数之前。
一个路由对于的默认调用链如下

```
[
'koa-compress',
'koa-bodyparser',
'koa-json',
'路由 middleware',
'路由处理函数'
]
```

实际示例：

```javascript
@Router({
    middleware: [someMiddleware]
})
```
