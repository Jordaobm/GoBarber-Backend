import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/iCreateUserDTO';
import IFindAllProvidersDTO from '../dtos/iFindAllProviders';

export default interface IUserRepository {
    findAllProviders(data:IFindAllProvidersDTO):Promise<User[]>;
    findById(id: string): Promise<User | undefined>;
    findByEmail(email: string): Promise<User | undefined>;
    create(data: ICreateUserDTO): Promise<User>;
    save(user: User): Promise<User>;
}