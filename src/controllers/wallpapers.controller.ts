import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Wallpaper } from '@interfaces/wallpapers.interface';
import { WallpaperService } from '@services/wallpapers.service';

export class WallpaperController {
  public wallpaper = Container.get(WallpaperService);

  public getWallpapers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllWallpapersData: Wallpaper[] = await this.wallpaper.findAllWallpaper();

      res.status(200).json({ data: findAllWallpapersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getWallpaperById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallpaperId: string = req.params.id;
      const findOneWallpaperData: Wallpaper = await this.wallpaper.findWallpaperById(wallpaperId);

      res.status(200).json({ data: findOneWallpaperData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createWallpaper = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallpaperData: Wallpaper = req.body;
      const createWallpaperData: Wallpaper = await this.wallpaper.createWallpaper(wallpaperData);

      res.status(201).json({ data: createWallpaperData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateWallpaper = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallpaperId: string = req.params.id;
      const wallpaperData: Wallpaper = req.body;
      const updateWallpaperData: Wallpaper = await this.wallpaper.updateWallpaper(wallpaperId, wallpaperData);

      res.status(200).json({ data: updateWallpaperData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWallpaper = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallpaperId: string = req.params.id;
      const deleteWallpaperData: Wallpaper = await this.wallpaper.deleteWallpaper(wallpaperId);

      res.status(200).json({ data: deleteWallpaperData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
