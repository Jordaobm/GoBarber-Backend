import "reflect-metadata";
import { injectable, inject } from 'tsyringe';
import IAppointmentsRepository from '../repositories/iAppointmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day:number;
}



@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

    ) { }

    public async execute({ provider_id, year, month, day }: IRequest): Promise<Appointment[]> {
        const apppointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id, year, month, day
        });


        return apppointments;
    }
}

export default ListProviderAppointmentsService;