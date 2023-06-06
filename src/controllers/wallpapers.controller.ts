import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { Wallpaper } from '@interfaces/wallpapers.interface';
import { WallpaperService } from '@services/wallpapers.service';

export class WallpaperController {
  public wallpaper = Container.get(WallpaperService);

  public getWallpapers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageOptions = {
        page: +req.query?.page || 0,
        limit: +req.query?.limit || 10000,
      };
      const findAllWallpapersData: Wallpaper[] = await this.wallpaper.findAllWallpaper(pageOptions);

      const data = [
        {
          _id: '11',
          type: 'image',
          subtype: 'jpeg',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-alex-quezada-15886917.jpg'],
          name: 'quezada',
          __v: 0,
        },
        {
          _id: '12',
          type: 'image',
          subtype: 'jpeg',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-vikram-aditya-12156639.jpg'],
          name: 'vikram',
          __v: 0,
        },
        {
          _id: '13',
          type: 'image',
          subtype: 'jpeg',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-mahdi-bafande-15886790.jpg'],
          name: 'bafande',
          __v: 0,
        },
        {
          _id: '14',
          type: 'image',
          subtype: 'neona',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-vikram-aditya-12156639.jpg'],
          name: 'aditya',
          __v: 0,
        },
        {
          _id: '15',
          type: 'image',
          subtype: 'neona',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-aurore-12146142.jpg'],
          name: 'aurore',
          __v: 0,
        },
        {
          _id: '16',
          type: 'image',
          subtype: 'neon',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-skyler-ewing-14758944.jpg'],
          name: 'skyler',
          __v: 0,
        },
        {
          _id: '17',
          type: 'image',
          subtype: 'neon',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-serg-alesenko-15890472.jpg'],
          name: 'pexels',
          __v: 0,
        },
        {
          _id: '18',
          type: 'parallax',
          subtype: 'hui',
          url: [
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/parallax/one/apocalypse_back.webp',
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/parallax/one/apocalypse_backMsk.webp',
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/parallax/one/apocalypse_middle.webp',
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/parallax/one/apocalypse_middleMsk.webp',
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/parallax/one/apocalypse_preview.webp',
          ],
          name: 'parallax',
          __v: 0,
        },
        {
          _id: '19',
          type: 'theme',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-serg-alesenko-15890472.jpg'],
          name: 'serg',
          __v: 0,
        },
        {
          _id: '20',
          type: 'theme',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/image/abstraction/pexels-serg-alesenko-15890472.jpg'],
          name: 'alesenko',
          __v: 0,
        },
        {
          _id: '21',
          type: 'video',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/video/pexels-adem-albayrak-15415824-1080x1920-30fps.mp4'],
          name: 'adem',
          __v: 0,
        },
        {
          _id: '22',
          type: 'video',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/video/pexels-ahmed-abd-allah-6217440-1080x1920-30fps.mp4'],
          name: 'abd',
          __v: 0,
        },
        {
          _id: '23',
          type: 'video',
          subtype: 'theme',
          url: [
            'https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/video/pexels-ahmed-raza-khan-films-15441525-720x1280-24fps.mp4',
          ],
          name: 'raza',
          __v: 0,
        },
        {
          _id: '24',
          type: 'video',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/video/pexels-ahmed-%E3%83%84-13901378-1080x1632-60fps.mp4'],
          name: 'ahmed',
          __v: 0,
        },
        {
          _id: '25',
          type: 'video',
          subtype: 'theme',
          url: ['https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/wallpapers/video/pexels-ahmet-akpolat-6521673-2160x3840-30fps.mp4'],
          name: 'akpolat',
          __v: 0,
        },
      ];

      res.status(200).json({ data, message: 'findAll' });
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

  public getWallpaperByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wallpaperName: string = req.query?.name as string;
      const findOneWallpaperData: Wallpaper = await this.wallpaper.findWallpaperByName(wallpaperName);

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
