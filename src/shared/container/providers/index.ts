import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IStorageProvider from './StorageProviders/models/iStorageProvider';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/iMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from './MailProvider/implementations/SESMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';


container.registerSingleton<IStorageProvider>(
    'StorageProvider',
    DiskStorageProvider,
)

container.registerSingleton<IMailTemplateProvider>(
    'MailTemplateProvider',
    HandlebarMailTemplateProvider,
)

container.registerInstance<IMailProvider>(
    'MailProvider',
    mailConfig.driver == 'ethereal' ? container.resolve( EtherealMailProvider):
    container.resolve( SESMailProvider),
)
