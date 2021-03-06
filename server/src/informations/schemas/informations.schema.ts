import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

export type InformationDocument = Information & mongoose.Document;

@Schema({ timestamps: true })
export class Information {
  @Prop(Date)
  birthDate: Date;

  @Prop()
  status: string;

  @Prop()
  sex: string;

  @Prop([String])
  hobbies: string[];

  @Prop([String])
  languages: string[];

  @Prop([String])
  images: string[];

  @Prop(
    raw({
      longitude: { type: Number },
      latitude: { type: Number },
    }),
  )
  coordinates: Record<string, number>;
}

export const InformationSchema = SchemaFactory.createForClass(Information);
