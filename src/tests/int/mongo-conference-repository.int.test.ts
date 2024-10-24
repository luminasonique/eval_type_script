import { Model } from "mongoose";
import { MongoConference } from "../../infrastructure/database/mongo/mongo-conference";
import { MongoConferenceRepository } from "../../infrastructure/database/mongo/mongo-conference-repository";
import { TestApp } from "../e2e/utils/test-app";
import { e2eConferences } from "../e2e/seeds/conference-e2e-seed";
import { Conference } from "../../domain/entities/conference.entity";
import { addDays, addHours } from "date-fns";

describe('MongoConferenceRepository Integration', () => {
    let app: TestApp;
    let model: Model<MongoConference.ConferenceDocument>;
    let repository: MongoConferenceRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoConference.ConferenceModel;
        await model.deleteMany({});
        repository = new MongoConferenceRepository(model);

        
        const record = new model({
            _id: e2eConferences.conference.entity.props.id,
            organizerId: e2eConferences.conference.entity.props.organizerId,
            title: e2eConferences.conference.entity.props.title,
            startDate: e2eConferences.conference.entity.props.startDate,
            endDate: e2eConferences.conference.entity.props.endDate,
            seats: e2eConferences.conference.entity.props.seats
        });

        await record.save();
    });

    afterAll(async () => {
        await app.teardown();
    });

    describe('findById', () => {
        it('should return a conference corresponding to the id', async () => {
            const conference = await repository.findById(e2eConferences.conference.entity.props.id);
            expect(conference!.props).toEqual(e2eConferences.conference.entity.props);
        });

        it('should return null if conference does not exist', async () => {
            const conference = await repository.findById('non-existing-id');
            expect(conference).toBeNull();
        });
    });

    describe('create', () => {
        it('should insert a conference in the collection', async () => {
            const newConference = new Conference({
                id: 'id-2',
                organizerId: e2eConferences.conference.entity.props.organizerId,
                title: 'New Conference Title',
                startDate: addDays(new Date(), 5),
                endDate: addDays(addHours(new Date(), 2), 5),
                seats: 100
            });

            await repository.create(newConference);
            const foundConference = await model.findOne({ _id: newConference.props.id });
            expect(foundConference).toEqual({
                _id: newConference.props.id,
                organizerId: newConference.props.organizerId,
                title: newConference.props.title,
                startDate: newConference.props.startDate,
                endDate: newConference.props.endDate,
                seats: newConference.props.seats,
                __v: 0
            });
        });

        it('should throw an error if conference already exists', async () => {
            await expect(repository.create(e2eConferences.conference.entity)).rejects.toThrow('Conference already exists');
        });
    });
});
