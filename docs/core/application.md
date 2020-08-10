# Application

Application 是一个应用的主入口。
当调用`ApplicationFactory.create`工厂函数时，函数会返回一个`Application`实例。`Application`是`koa.Application`的子类，继承了所有`koa.Application`的属性，并增加了以下几个属性：

- config，包含了所有的配置信息，详情参考[配置](core/config)
- rootScope，包含了所有扩展的内容，详情参考[扩展](core/extend)
- rootRouter，根路由对象。详情参考[路由](/core/router)

## 中间件

`Application`是完全继承 koa 的，同样兼容 koa 的`middleware`的用法。
在构造一个`Application`实例时，会按顺序预加载以下必要的中间件

1. [koa-compress](https://github.com/koajs/compress)，用于处理压缩
2. [koa-bodyparser](https://github.com/koajs/bodyparser)，用于处理 body 解析
3. [koa-json](https://github.com/koajs/json)，用于 json 处理

如果要使用自定义的中间件，可以通过`app.use(middleware)`进行添加。

