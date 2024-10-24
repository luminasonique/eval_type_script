import { asClass, asFunction, createContainer } from "awilix";
import { IAuthenticator } from "../../interfaces/authenticator.interface";
import { IConferenceRepository } from "../../interfaces/conference-repository.interface";
import { IDateGenerator } from "../../interfaces/date-generator.interface";
import { IIDGenerator } from "../../interfaces/id-generator.interface";
import { IUserRepository } from "../../interfaces/user-repository.interface";
import { CurrentDateGenerator } from "../../shared/utils/current-date-generator";
import { RandomIDGenerator } from "../../shared/utils/random-id-generator";
import { InMemoryConferenceRepository } from "../../tests/in-memory/in-memory-conference-repository";
import { InMemoryUserRepository } from "../../tests/in-memory/in-memory-user-repository";
import { ChangeSeats } from "../../usecases/change-seats";
import { OrganizeConference } from "../../usecases/organize-conference";
import { BasicAuthenticator } from "../authenticators/basic-authenticator";

import { ChangeDates } from "../../usecases/change-dates";
import { InMemoryMailer } from "../../tests/in-memory/in-memory-mailer";
import { InMemoryBookingRepository } from "../../tests/in-memory/in-memory-booking-repository";


export interface Dependencies {
    conferenceRepository: IConferenceRepository
    userRepository: IUserRepository
    idGenerator: IIDGenerator
    dateGenerator: IDateGenerator
    authenticator: IAuthenticator
    organizeConferenceUsecase: OrganizeConference
    changeSeatsUsecase: ChangeSeats
    changeDatesUsecase: ChangeDates
    mailer: InMemoryMailer
    bookingRepository: InMemoryBookingRepository
}

const container = createContainer<Dependencies>()

container.register({
    conferenceRepository: asClass(InMemoryConferenceRepository).singleton(),
    userRepository: asClass(InMemoryUserRepository).singleton(),
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    mailer:asClass(InMemoryMailer).singleton(),

    authenticator: asFunction(
        ({userRepository}) => new BasicAuthenticator(userRepository)
    ).singleton(),

    organizeConferenceUsecase: asFunction(
        ({conferenceRepository, idGenerator, dateGenerator}) => new OrganizeConference(conferenceRepository, idGenerator, dateGenerator)
    ).singleton(),
    
    changeSeatsUsecase: asFunction(
        ({conferenceRepository}) => new ChangeSeats(conferenceRepository)
    ).singleton(),
    
    
    bookingRepository: asClass(InMemoryBookingRepository).singleton(),
    
    changeDatesUsecase: asFunction(
        ({conferenceRepository, mailer, bookingRepository, userRepository, dateGenerator}) => 
            new ChangeDates(conferenceRepository, mailer, bookingRepository, userRepository, dateGenerator)
    ).singleton()
})

export type ResolveDependency = <K extends keyof Dependencies>(key: K) => Dependencies[K]

const resolveDependency = <K extends keyof Dependencies>(key: K) : Dependencies[K] => {
    return container.resolve<K>(key)
}

export { resolveDependency as container };
