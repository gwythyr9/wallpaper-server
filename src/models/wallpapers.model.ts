import { model, Schema, Document } from 'mongoose';
import { Wallpaper } from '@interfaces/wallpapers.interface';

const WallpaperSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
  },
  subtype: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export const WallpaperModel = model<Wallpaper & Document>('Wallpaper', WallpaperSchema);
