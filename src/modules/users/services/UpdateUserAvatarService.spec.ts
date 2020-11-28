import 'reflect-metadata';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;


describe('UpdateUserAvatar', () => {

    beforeEach(() => {
        fakeAppointmentsRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakeAppointmentsRepository, fakeStorageProvider)

    })

    it('should be able to create a new user', async () => {


        const user = await fakeAppointmentsRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '1234567890'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })
        expect(user.avatar).toBe('avatar.jpg');
    })


    it('should not be able to update avatar from non existing user', async () => {


        await expect(updateUserAvatar.execute({
            user_id: 'non-existing-user',
            avatarFilename: 'avatar.jpg'
        })).rejects.toBeInstanceOf(AppError);
    })



    it('should delete old avatar when updating new one', async () => {

        const user = await fakeAppointmentsRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '1234567890'
        })

        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg'
        })

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg'
        })

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg')

        expect(user.avatar).toBe('avatar2.jpg');
    })

});
