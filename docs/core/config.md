# 配置

当使用`ApplicationFactory.create`构建实例时，会首先加载`./config`默认配置文件。可以通过修改`TIT_CONFIG_DIR`环境变量修改。

例如：

默认加载:`/appRoot/config.js` 或 `/appRoot/config/index.js`

如果`TIT_CONFIG_DIR`设置为`./configENV`，则加载`/appRoot/configENV.js` 或 `/appRoot/configENV/index.js`

## 配置文件格式

配置文件支持`.json`或`.js`，当配置文件是一个`.js`文件时，必须符合 [CommonJS](https://requirejs.org/docs/commonjs.html) 规范。

以下是配置示例：

JSON:

```json
{
  "port": 8080
}
```

JS:

```TypeScript
module.exports = {
  port: 8080,
};
```
