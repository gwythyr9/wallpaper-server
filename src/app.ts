import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { connect, set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Container } from 'typedi';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { dbConnection } from '@database';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { WallpaperService } from '@services/wallpapers.service';
import { Wallpaper } from '@interfaces/wallpapers.interface';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
    this.initializeS3Aws();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }

    await connect(dbConnection.url);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      console.log(route.router);
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }

  private async initializeS3Aws() {
    const REGION = 'us-east-1';
    const BUCKET = 'lookoutvision-us-east-1-12447157cd';
    const client = new S3Client({ region: REGION });
    const getListOfVideo = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'wallpapers/video',
      MaxKeys: 1000,
    });
    const getListOfImage = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'wallpapers/image',
      MaxKeys: 1000,
    });
    const getListOfTheme = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'wallpapers/theme/theme',
      MaxKeys: 1000,
    });
    const getListOfParallaxFolders = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'wallpapers/parallax',
      Delimiter: '.',
      MaxKeys: 1000,
    });
    try {
      const { Contents: video } = await client.send(getListOfVideo);
      const { Contents: images } = await client.send(getListOfImage);
      const { Contents: theme } = await client.send(getListOfTheme);
      video.shift();
      images.shift();
      theme.shift();
      const data = [...video, ...images];
      const wallpaper = Container.get(WallpaperService);
      for (const imageTheme of theme) {
        const imageKey = imageTheme.Key.replace('wallpapers/', '');
        console.log(imageTheme);
        const imageSplit = imageKey.split('/');
        const wallpaperData: Wallpaper = {
          url: [`https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${imageTheme.Key}`],
          type: 'theme',
          subtype: 'theme',
          name: imageSplit[2],
        };
        console.log(imageSplit[2]);
        await wallpaper.createWallpaper(wallpaperData);
      }

      for (const image of data) {
        const imageKey = image.Key.replace('wallpapers/', '');
        const imageSplit = imageKey.split('/');
        if (
          imageSplit?.[2] === '' ||
          (imageSplit?.[1] === '' && (imageSplit?.[0] === 'video' || imageSplit?.[0] === 'image' || imageSplit?.[0] === 'theme'))
        )
          continue;
        const wallpaperData: Wallpaper = {
          url: [`https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${image.Key}`],
          type: imageSplit?.[0],
          subtype: imageSplit?.[0] === 'video' ? imageSplit[0] : imageSplit[1],
          name: imageSplit?.[2] || imageSplit[1],
        };
        await wallpaper.createWallpaper(wallpaperData);
      }
      const { Contents: parallaxFolders } = await client.send(getListOfParallaxFolders);
      parallaxFolders.shift();
      for (const folder of parallaxFolders) {
        const getListFolderFiles = new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: folder.Key,
          MaxKeys: 1000,
        });
        const { Contents: parallaxFiles } = await client.send(getListFolderFiles);
        parallaxFiles.shift();
        const parallaxUrls = parallaxFiles.map(u => `https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${u.Key}`);
        const imageKey = folder.Key.replace('wallpapers/', '');
        const imageSplit = imageKey.split('/');
        const wallpaperData: Wallpaper = {
          url: parallaxUrls,
          type: imageSplit[0],
          subtype: imageSplit[1],
          name: imageSplit[0] + imageSplit[1],
        };
        await wallpaper.createWallpaper(wallpaperData);
      }
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      this.initializeS3Aws();
    }, 5 * 60 * 1000);
  }
}
