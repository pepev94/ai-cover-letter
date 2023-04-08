import { prop, getModelForClass } from "@typegoose/typegoose";

export class User {
  @prop()
  public name?: string;

  @prop()
  public email?: string;

  @prop({ default: null })
  public subscriptionId?: string | null;
}

const UserModel = getModelForClass(User);

export default UserModel;
