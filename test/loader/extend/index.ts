import { Application, IExtend } from '../../../src';

export default class TestExtend implements IExtend {
  reduce(app: Application) :void{
    console.log(app);
    return;
  }
}
