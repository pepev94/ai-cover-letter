import { prop, getModelForClass, Ref } from "@typegoose/typegoose";
import { User } from "./User";

export class StripeToken {
  @prop()
  public token?: string;

  @prop({ ref: "User" })
  public user_id?: User;
}

const StripeTokenModel = getModelForClass(StripeToken);

export default StripeTokenModel;
