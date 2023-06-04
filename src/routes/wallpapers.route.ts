import { Router } from 'express';
import { WallpaperController } from '@controllers/wallpapers.controller';
import { CreateWallpaperDto } from '@dtos/wallpapers.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class WallpaperRoute implements Routes {
  public path = '/wallpapers';
  public router = Router();
  public wallpaperController = new WallpaperController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/one/`, this.wallpaperController.getWallpaperByName);
    this.router.get(`${this.path}/:page?/:limit?`, this.wallpaperController.getWallpapers);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateWallpaperDto), this.wallpaperController.createWallpaper);
    this.router.put(`${this.path}/:id`, ValidationMiddleware(CreateWallpaperDto, false, true), this.wallpaperController.updateWallpaper);
    this.router.delete(`${this.path}/:id`, this.wallpaperController.deleteWallpaper);
  }
}
