// // auth.model.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document } from 'mongoose';

// @Schema()
// export class Auth extends Document {

//   @Prop({ required: true })
//   name: string;

//   @Prop({ required: true, unique: true })
//   email: string;

//   @Prop({ required: true })
//   password: string;

//   @Prop({ required: false })
//   roles: string[];
// }

// export const AuthSchema = SchemaFactory.createForClass(Auth);
