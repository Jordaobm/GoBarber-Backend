import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';
//import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/iUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import { isAfter, addHours } from 'date-fns';

interface IRequest {
    token: string;
    password: string;
}

@injectable()
class ResetPasswordService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository')
        private userTokensRepository: IUserTokensRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) { }

    public async execute({ token, password }: IRequest): Promise<void> {

        const userToken = await this.userTokensRepository.findByToken(token)

        if (!userToken) {
            throw new AppError("User token does not exists");

        }

        const user = await this.usersRepository.findById(userToken.user_id)


        if (!user) {
            throw new AppError("User does not exists");
        }

        const tokenCreateAt = userToken.created_at;
        const compareDate = addHours(tokenCreateAt, 2);

        if(isAfter(Date.now(), compareDate)){
            throw new AppError('token expired')
        }


        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);

    }
}

export default ResetPasswordService;
