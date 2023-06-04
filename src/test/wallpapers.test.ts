import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';
import { App } from '@/app';
import { CreateWallpaperDto } from '@dtos/wallpapers.dto';
import { WallpaperRoute } from '@routes/wallpapers.route';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Wallpapers', () => {
  describe('[GET] /wallpapers', () => {
    it('response fineAll Wallpapers', async () => {
      const wallpapersRoute = new WallpaperRoute();
      const wallpapers = wallpapersRoute.wallpapersController.wallpaperService.wallpapers;

      wallpapers.find = jest.fn().mockReturnValue([
        {
          _id: 'qpwoeiruty',
          email: 'a@email.com',
          password: await bcrypt.hash('q1w2e3r4!', 10),
        },
        {
          _id: 'alskdjfhg',
          email: 'b@email.com',
          password: await bcrypt.hash('a1s2d3f4!', 10),
        },
        {
          _id: 'zmxncbv',
          email: 'c@email.com',
          password: await bcrypt.hash('z1x2c3v4!', 10),
        },
      ]);

      (mongoose as any).connect = jest.fn();
      const app = new App([wallpapersRoute]);
      return request(app.getServer()).get(`${wallpapersRoute.path}`).expect(200);
    });
  });

  describe('[GET] /wallpapers/:id', () => {
    it('response findOne Wallpaper', async () => {
      const wallpaperId = 'qpwoeiruty';

      const wallpapersRoute = new WallpaperRoute();
      const wallpapers = wallpapersRoute.wallpapersController.wallpaperService.wallpapers;

      wallpapers.findOne = jest.fn().mockReturnValue({
        _id: 'qpwoeiruty',
        email: 'a@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([wallpapersRoute]);
      return request(app.getServer()).get(`${wallpapersRoute.path}/${wallpaperId}`).expect(200);
    });
  });

  describe('[POST] /wallpapers', () => {
    it('response Create Wallpaper', async () => {
      const wallpaperData: CreateWallpaperDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const wallpapersRoute = new WallpaperRoute();
      const wallpapers = wallpapersRoute.wallpapersController.wallpaperService.wallpapers;

      wallpapers.findOne = jest.fn().mockReturnValue(null);
      wallpapers.create = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: wallpaperData.email,
        password: await bcrypt.hash(wallpaperData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([wallpapersRoute]);
      return request(app.getServer()).post(`${wallpapersRoute.path}`).send(wallpaperData).expect(201);
    });
  });

  describe('[PUT] /wallpapers/:id', () => {
    it('response Update Wallpaper', async () => {
      const wallpaperId = '60706478aad6c9ad19a31c84';
      const wallpaperData: CreateWallpaperDto = {
        email: 'test@email.com',
        password: 'q1w2e3r4',
      };

      const wallpapersRoute = new WallpaperRoute();
      const wallpapers = wallpapersRoute.wallpapersController.wallpaperService.wallpapers;

      if (wallpaperData.email) {
        wallpapers.findOne = jest.fn().mockReturnValue({
          _id: wallpaperId,
          email: wallpaperData.email,
          password: await bcrypt.hash(wallpaperData.password, 10),
        });
      }

      wallpapers.findByIdAndUpdate = jest.fn().mockReturnValue({
        _id: wallpaperId,
        email: wallpaperData.email,
        password: await bcrypt.hash(wallpaperData.password, 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([wallpapersRoute]);
      return request(app.getServer()).put(`${wallpapersRoute.path}/${wallpaperId}`).send(wallpaperData);
    });
  });

  describe('[DELETE] /wallpapers/:id', () => {
    it('response Delete Wallpaper', async () => {
      const wallpaperId = '60706478aad6c9ad19a31c84';

      const wallpapersRoute = new WallpaperRoute();
      const wallpapers = wallpapersRoute.wallpapersController.wallpaperService.wallpapers;

      wallpapers.findByIdAndDelete = jest.fn().mockReturnValue({
        _id: '60706478aad6c9ad19a31c84',
        email: 'test@email.com',
        password: await bcrypt.hash('q1w2e3r4!', 10),
      });

      (mongoose as any).connect = jest.fn();
      const app = new App([wallpapersRoute]);
      return request(app.getServer()).delete(`${wallpapersRoute.path}/${wallpaperId}`).expect(200);
    });
  });
});
