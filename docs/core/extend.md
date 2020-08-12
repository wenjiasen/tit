# Extend

在实际开发中，通常会需要全局共享一些实例，例如数据库链接，Redis 链接等。框架支持以`Extend`的方式将某些属性挂载到全局`app`实例中。

例如以下实现了将 MySQL 链接实例挂载到 `app.rootScope` 实例中，方便全局访问。

```javascript

import { IExtend, Application } from 'tit';
import { createConnection, Connection } from 'typeorm';
import path from 'path';

// 利用TypeScript 类型合并功能定义扩展配置
declare module 'tit/dist/application' {
  interface IConfig {
    mysql: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
  }
  interface IScope {
    getMysql: () => Promise<Connection>;
  }
}
export default class MysqlExtend implements IExtend {
  reduce(app: Application): void {
    let connPromise: Promise<Connection>;
    // 此处返回一个单例的MySQL Connection
    app.rootScope.getMysql = (): Promise<Connection> => {
      const { config } = app;
      if (!connPromise) {
        connPromise = createConnection({
          type: 'mysql',
          host: config.mysql.host,
          port: config.mysql.port,
          username: config.mysql.username,
          password: config.mysql.password,
          database: config.mysql.database
        });
      }
      return connPromise;
    };
  }
}

```

## IExtend 接口

框架提供了`IExtend`接口，所有的扩展应该实现此接口。

接口定义：

```javascript
interface IExtend {
  reduce: (app: Application) => void;
}
```
