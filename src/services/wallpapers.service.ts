import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { Wallpaper } from '@interfaces/wallpapers.interface';
import { WallpaperModel } from '@models/wallpapers.model';

@Service()
export class WallpaperService {
  public async findAllWallpaper(pageOptions: { page: number; limit: number }): Promise<Wallpaper[]> {
    const wallpapers: Wallpaper[] = await WallpaperModel.find()
      .skip(pageOptions?.page * pageOptions.limit)
      .limit(pageOptions.limit);
    return wallpapers;
  }

  public async findWallpaperById(wallpaperId: string): Promise<Wallpaper> {
    const findWallpaper: Wallpaper = await WallpaperModel.findOne({ _id: wallpaperId });
    if (!findWallpaper) throw new HttpException(409, "Wallpaper doesn't exist");

    return findWallpaper;
  }

  public async findWallpaperByName(wallpaperName: string): Promise<Wallpaper> {
    const findWallpaper: Wallpaper = await WallpaperModel.findOne({ name: wallpaperName });
    if (!findWallpaper) throw new HttpException(409, "Wallpaper doesn't exist");

    return findWallpaper;
  }

  public async createWallpaper(wallpaperData: Wallpaper): Promise<Wallpaper> {
    const findWallpaper: Wallpaper = await WallpaperModel.findOne({ name: wallpaperData.name });
    if (findWallpaper) {
      return null;
    }

    const createWallpaperData: Wallpaper = await WallpaperModel.create({ ...wallpaperData });

    return createWallpaperData;
  }

  public async updateWallpaper(wallpaperId: string, wallpaperData: Wallpaper): Promise<Wallpaper> {
    if (wallpaperData.name) {
      const findWallpaper: Wallpaper = await WallpaperModel.findOne({ name: wallpaperData.name });
      if (findWallpaper && findWallpaper._id != wallpaperId) throw new HttpException(409, `This wallpaper ${wallpaperData.name} already exists`);
    }

    const updateWallpaperById: Wallpaper = await WallpaperModel.findByIdAndUpdate(wallpaperId, { wallpaperData });
    if (!updateWallpaperById) throw new HttpException(409, "Wallpaper doesn't exist");

    return updateWallpaperById;
  }

  public async deleteWallpaper(wallpaperId: string): Promise<Wallpaper> {
    const deleteWallpaperById: Wallpaper = await WallpaperModel.findByIdAndDelete(wallpaperId);
    if (!deleteWallpaperById) throw new HttpException(409, "Wallpaper doesn't exist");

    return deleteWallpaperById;
  }
}
