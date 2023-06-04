import { Router } from 'express';
import { WallpaperController } from '@controllers/wallpapers.controller';
import { CreateWallpaperDto } from '@dtos/wallpapers.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class WallpaperRoute implements Routes {
  public path = '/wallpapers';
  public router = Router();
  public wallpaper = new WallpaperController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.wallpaper.getWallpapers);
    this.router.get(`${this.path}/:name`, this.wallpaper.getWallpaperByName);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateWallpaperDto), this.wallpaper.createWallpaper);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateWallpaperDto, false, true), this.wallpaper.updateWallpaper);
    this.router.delete(`${this.path}/:id`, this.wallpaper.deleteWallpaper);
  }
}
