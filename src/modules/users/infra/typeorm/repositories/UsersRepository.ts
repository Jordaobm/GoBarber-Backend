import { getRepository, Repository, Not } from 'typeorm';

import IUserRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/iFindAllProviders';

import User from '../entities/User';

class UsersRepository implements IUserRepository {
    private ormRepositoy: Repository<User>;

    constructor() {
        this.ormRepositoy = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepositoy.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepositoy.findOne({
            where: { email },
        });
        return user;
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if (except_user_id) {
            users = await this.ormRepositoy.find({
                where: {
                    id: Not(except_user_id),
                }
            })
        } else {
            users = await this.ormRepositoy.find()
        }

        return users;
    }

    public async create(userData: iCreateUserDTO): Promise<User> {
        const user = this.ormRepositoy.create(userData);

        await this.ormRepositoy.save(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepositoy.save(user);
    }
}

export default UsersRepository;