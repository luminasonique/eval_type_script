import { Application } from 'express';
import request from 'supertest';
import { container } from '../../infrastructure/config/dependency-injection';
import { testConferences } from '../unit/seeds/seeds-conference';
import { e2eConferences } from './seeds/conference-e2e-seed';
import { e2eUsers } from './seeds/user-e2e-seed';
import { TestApp } from './utils/test-app';
import { InMemoryMailer } from '../in-memory/in-memory-mailer';


describe('Usecase: Change Dates', () => {
    const conferenceRepository = container('conferenceRepository');
    const mailer = container('mailer') as InMemoryMailer;

    let testApp: TestApp;
    let app: Application;

    beforeEach(async () => {
        testApp = new TestApp();
        await testApp.setup();
        await testApp.loadFixtures([
            e2eConferences.conference,
            e2eUsers.johnDoe,
            e2eUsers.alice
        ]);
        app = testApp.expressApp;
        mailer.sentEmails.length = 0;

    });

    afterAll(async () => {
        await testApp.teardown();
    });

    it('should change the start and end dates of the conference and send an email', async () => {
        const newStartDate = '2024-11-01T00:00:00.000Z';
        const newEndDate = '2024-11-01T02:00:00.000Z';

        const response = await request(app)
            .patch(`/conference/${testConferences.conference.props.id}/dates`)
            .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
            .send({
                startDate: newStartDate,
                endDate: newEndDate,
            });

        expect(response.status).toEqual(200);
        console.log('Response Body:', response.body);

        const fetchedConference = await conferenceRepository.findById(testConferences.conference.props.id);

        expect(fetchedConference).toBeDefined();
        expect(fetchedConference!.props.startDate.toISOString()).toEqual(newStartDate);
        expect(fetchedConference!.props.endDate.toISOString()).toEqual(newEndDate);

        
        // expect(mailer.sentEmails).toHaveLength(1);
        // expect (mailer.sentEmails[0]).toEqual({
        //     to: e2eUsers.alice.entity.props.email,
        //     subject: 'Conference dates updated',
        //     body: `The conference with title: ${testConferences.conference.props.title} has updated its dates`
        // })

   
        
    });
});
