import { Controller, HttpMethod, Router, TitController, ReqBody } from '../../../src';
import { PostCreate, PostPublic } from '../dto/post.dto';

@Controller({
  prefix: '/api/v1/post',
})
export default class PostController extends TitController {
  @Router({
    method: HttpMethod.POST,
    path: '',
  })
  public async post(
    @ReqBody(PostCreate)
    body: PostCreate,
  ): Promise<PostPublic> {
    return {
      ...body,
      createDate: new Date(),
      id: '1',
    };
  }
}
