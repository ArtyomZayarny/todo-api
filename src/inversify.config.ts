import { Container } from 'inversify';
import { UserService } from './modules/user/user.service.ts';
import TYPES from './constant/types.ts';

const APIContainer = new Container();
APIContainer.bind<UserService>(TYPES.UserService).to(UserService);

export { APIContainer };
