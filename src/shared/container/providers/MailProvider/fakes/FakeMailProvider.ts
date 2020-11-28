import ISendMailDTO from '../dtos/ISendMailDTO';
import iMailProvider from '../models/iMailProvider';


export default class FakeMailProvider implements iMailProvider {
    private messages: ISendMailDTO[] = []

    public async sendMail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message);
    }

}
