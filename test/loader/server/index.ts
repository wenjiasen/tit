import { TitServer } from '../../../src';

export class TestServer extends TitServer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public copy(value: any): any {
    return value;
  }
}
