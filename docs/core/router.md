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

> `@Router`只能和使用`@Controller`装饰过的`TitController`中使用

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

## 参数检查

框架提供了`@PBody`、`@PQuery`、`@PParam`三种**参数**装饰器。

`Tit`内部使用[Joi](https://github.com/sideway/joi/blob/master/API.md)作为参数校验组件，配合以上三个参数装饰器使用可以极大简化代码中参数校验的工作。

### @PParam 装饰器

用来检查 param 参数

示例：检查 url 中是否包含 id 参数。

```javascript
    @Router({
      path: '/user/:id', // 注意此处的param参数":id"，必须和@PParam装饰的参数名保持一致
      method: HttpMethod.GET,
    })
    public async load(@PPram(Joi.string().max(32).required()) id: string): Promise<void> {
        const { ctx, app } = this;
        ctx.body = {
          userId: id
        };
    }
```

### @PQuery 装饰器

用来检查 query 参数

示例：检查 url query 中是否包含 id 参数。

```javascript
    @Router({
      path: '/user', // 注意此处不需要特殊声明，实际请求时回从query中获取检查
      method: HttpMethod.GET,
    })
    public async search(@PQuery(Joi.string().max(32)) id: string): Promise<void> {
        const { ctx, app } = this;
        ctx.body = {
          userId: id
        };
    }
```

### @PBody 装饰器

用来检查 body 参数

示例：检查 body 中是否包含 name 参数。

```javascript
    @Router({
      path: '/user',
      method: HttpMethod.POST,
    })
    public async create(@PBody({name: Joi.string().max(32).required() }) body: { name: string }): Promise<void> {
        const { ctx, app } = this;
        ctx.body = {
            name: body.names
        }
    }
```

> 注意：

- @PBody 需要传入的是一个 Object 类型的验证。
- 参数名必须是`body`，且类型需要自己定义

## Server 注入

为了方便 Controller 中使用`Server`实例，框架提供一个简单的 Server 注入装饰器`@PServer`

使用示例：
```javascript
    @Router({
      path: '/user',
      method: HttpMethod.POST,
    })
    public async create(
      @PBody({name: Joi.string().max(32).required() }) body: { name: string },
      @PServer(UserServer) userServerInstance: UserServer
      ): Promise<void> {
        const { ctx, app } = this;
        const userInfo = await userServerInstance.createUser(body);
        ctx.body = userInfo;
    }
```