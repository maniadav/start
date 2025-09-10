import mongoose, { Document, Schema } from "mongoose";
import { IOrganisationProfile } from "./organisation.profile.model";
import { IObserverProfile } from "./observer.profile.model";
import { IChild } from "./child.model";
import TASK_TYPE from "../constants/survey.type.constant";

export interface ICredential extends Document {
  _id: string;
  organisation_id: IOrganisationProfile["_id"];
  aws_access_key: string;
  aws_secret_access_key: string;
  aws_bucket_name: string;
  aws_bucket_region: string;
  date_created: Date;
}


const CredentialSchema = new Schema<ICredential>({
  organisation_id: {
    type: Schema.Types.ObjectId,
    ref: "OrganisationProfile",
    required: true,
    index: true,
  },
  aws_access_key: {
    type: String,
    required: true,
  },
  aws_secret_access_key: {
    type: String,
    required: true,
  },
  aws_bucket_name: {
    type: String,
    required: true,
  },
  aws_bucket_region: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
});

const CredentialModel =
  mongoose.models.Credential ||
  mongoose.model<ICredential>("Credential", CredentialSchema);
export default CredentialModel;
