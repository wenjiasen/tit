# Server

查看此章节内容，如果还不了解[Controller](./controller)，请先了解 Controller 相关文档

## 定义一个 Server

框架默认会加载`src/server`中的所有文件。

框架提供了`TitServer`基类，所有的自定义 Server 类都需要继承此类。并且需要使用`@Server`装饰器定义。

一个简单的示例：

```javascript
import { TitServer, Server} from 'tit';

@Controller({
  prefix: '/api',
})
export class IndexServer extends TitServer {
    /**
     * 模拟创建用户
     */
    public async createUser(name: string): Promise<UserModel> {
         const conn = await this.app.rootScope.getMysql();
         // ...
         // 使用SQL语句创建user
         // ...
         return user;
    }
}

```

> TitServer 包含了对全局 app 的引用，配合 Extend 扩展的内容可以实现丰富的功能
