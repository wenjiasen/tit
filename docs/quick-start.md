# 快速开始

## 安装

```shell
npm i tit
```

## 快速开始

```TypeScript
// app.ts
import { ApplicationFactory } from 'tit';

async function main(): Promise<void> {
  const app = await ApplicationFactory.create();
  app.use(app.rootRouter());
  app.listen();
}

main().catch(console.error);
```

`app.listen`会监听`app.config.port`指定的端口，如果未指定，则监听 80 端口。如何修改可查看[配置](/core/config)说明。

## tsconfig.json
框架使用了TypeScript的[Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)，需要在`tsconfig.json`中打开以下配置：

```json
// tsconfig.json
{
  // ...
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  // ...
}
```