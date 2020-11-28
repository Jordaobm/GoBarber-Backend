import { v4 as uuidv4 } from "uuid"
import IUserRepository from '@modules/users/repositories/iUsersRepository';
import iCreateUserDTO from '@modules/users/dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/iFindAllProviders';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUserRepository {

    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id == id);

        return findUser;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email == email);

        return findUser;
    }

    public async findAllProviders({except_user_id}: IFindAllProvidersDTO): Promise<User[]> {
        let  users  = this.users;

        if (except_user_id) {
            users = this.users.filter(users => users.id != except_user_id);
        }

        return users;
    }

    public async create(userData: iCreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuidv4() }, userData);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(findUser => findUser.id == user.id);

        this.users[findIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;