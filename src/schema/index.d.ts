declare namespace AnyTypes {
  /**
   * Service配置项
   */
  interface IService {
    protocol: 'http' | 'https';
    host: string;
    port: number;
    headers: { [key: string]: any };
  }

  type ServerType = '';
  type ServiceConfig = {
    [name in ServerType]: IService;
  };
  type MongoDBType = '';
  interface IMongDB {
    uri: string;
  }
  type MongoDBConfig = {
    [name in MongoDBType]: {};
  };

  interface IConfig {
    port: number;
    servers?: ServiceConfig;
    mongodb?: MongoDBConfig;
    sentry?: {
      dsn: string;
    };
  }
}
