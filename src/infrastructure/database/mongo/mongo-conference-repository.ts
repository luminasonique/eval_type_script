import { Model } from "mongoose";
import { IConferenceRepository } from "../../../interfaces/conference-repository.interface";
import { Conference } from "../../../domain/entities/conference.entity";
import { MongoConference } from "./mongo-conference";
 // Import the mapper

export class MongoConferenceRepository implements IConferenceRepository {
    constructor(
        private readonly model: Model<MongoConference.ConferenceDocument>
    ) {}

    async findById(id: string): Promise<Conference | null> {
        const document = await this.model.findById(id);
        if (!document) return null;
        return MongoConference.ConferenceMapper.toCore(document);  // Use the mapper to convert to domain entity
    }

    async create(conference: Conference): Promise<void> {
        const existingDocument = await this.model.findById(conference.props.id);
        if (existingDocument) throw new Error('Conference already exists');

        const conferenceDoc = MongoConference.ConferenceMapper.toPersistence(conference); // Convert to persistence model
        await conferenceDoc.save();
    }

    async update(conference: Conference): Promise<void> {
        const document = await this.model.findById(conference.props.id);
        if (!document) throw new Error('Conference not found');

        // Update the document with new values
        document.title = conference.props.title;
        document.startDate = conference.props.startDate;
        document.endDate = conference.props.endDate;
        document.seats = conference.props.seats;
        document.organizerId = conference.props.organizerId;

        await document.save();  
    }

  
}
