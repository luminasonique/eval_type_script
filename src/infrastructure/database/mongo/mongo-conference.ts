import mongoose, { Document, Schema } from "mongoose";
import { Conference } from "../../../domain/entities/conference.entity";

export namespace MongoConference {
    export const CollectionName = 'conferences';

    export interface ConferenceDocument extends Document {
        seats: number;
        _id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        organizerId: string;
    }

    export const ConferenceSchema = new Schema<ConferenceDocument>({
        _id: { type: String, required: true },
        title: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        seats: { type: Number, required: true },
        organizerId: { type: String, required: true }
    });

    export const ConferenceModel = mongoose.model<ConferenceDocument>(CollectionName, ConferenceSchema);

    // Adding the ConferenceMapper inside the MongoConference namespace
    export class ConferenceMapper {
        static toCore(document: ConferenceDocument): Conference {
            return new Conference({
                id: document._id,
                organizerId: document.organizerId,
                title: document.title,
                startDate: document.startDate,
                endDate: document.endDate,
                seats: document.seats
            });
        }

        static toPersistence(conference: Conference): ConferenceDocument {
            return new ConferenceModel({
                _id: conference.props.id,
                organizerId: conference.props.organizerId,
                title: conference.props.title,
                startDate: conference.props.startDate,
                endDate: conference.props.endDate,
                seats: conference.props.seats
            });
        }
    }
}
