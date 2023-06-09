import * as schedule from 'node-schedule';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Container } from 'typedi';
import { WallpaperService } from '@services/wallpapers.service';
import { Wallpaper } from '@interfaces/wallpapers.interface';

class WallpapersJobs {
  public refreshUrls() {
    schedule.scheduleJob('*/5 * * * *', async () => {
      const REGION = 'us-east-1';
      const BUCKET = 'lookoutvision-us-east-1-12447157cd';
      const client = new S3Client({ region: REGION });
      const getListOfVideo = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'wallpapers/video/video',
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
        Prefix: 'wallpapers/parallax/',
        Delimiter: '/',
        MaxKeys: 1000,
      });
      const wallpaper = Container.get(WallpaperService);
      const allWallpapers: Wallpaper[] = [];
      try {
        const { Contents: theme } = await client.send(getListOfTheme);
        theme.shift();
        for (const imageTheme of theme) {
          const imageKey = imageTheme.Key.replace('wallpapers/', '');
          const imageSplit = imageKey.split('/');
          console.log('file: wallpapers.jobs.ts:42 ~ WallpapersJobs ~ schedule.scheduleJob ~ imageSplit:', imageSplit);
          const wallpaperData: Wallpaper = {
            url: [`https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${imageTheme.Key}`],
            type: 'theme',
            subtype: 'theme',
            name: imageSplit[2],
          };
          allWallpapers.push(wallpaperData);
          // await wallpaper.createWallpaper(wallpaperData);
        }
        const { Contents: videos } = await client.send(getListOfVideo);
        videos.shift();
        for (const video of videos) {
          const videoKey = video.Key.replace('wallpapers/', '');
          const videoSplit = videoKey.split('/');
          const wallpaperData: Wallpaper = {
            url: [`https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${video.Key}`],
            type: 'video',
            subtype: 'video',
            name: videoSplit[2],
          };
          allWallpapers.push(wallpaperData);
          // await wallpaper.createWallpaper(wallpaperData);
        }
        const { Contents: images } = await client.send(getListOfImage);
        images.shift();
        const filtredImages = images.filter(i => !i.Key.endsWith('/'));
        for (const image of filtredImages) {
          const imageKey = image.Key.replace('wallpapers/', '');
          const imageSplit = imageKey.split('/');
          const wallpaperData: Wallpaper = {
            url: [`https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${image.Key}`],
            type: 'image',
            subtype: imageSplit[1],
            name: imageSplit[2],
          };
          // await wallpaper.createWallpaper(wallpaperData);
          allWallpapers.push(wallpaperData);
        }
        const response = await client.send(getListOfParallaxFolders);
        const folders = response.CommonPrefixes.map(commonPrefix => commonPrefix.Prefix);
        for (const folder of folders) {
          const getListFolderFiles = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: folder,
            MaxKeys: 1000,
          });
          const { Contents: parallaxFiles } = await client.send(getListFolderFiles);
          const parallaxUrls = parallaxFiles.map(u => `https://lookoutvision-us-east-1-12447157cd.s3.amazonaws.com/${u.Key}`);
          const imageKey = folder.replace('wallpapers/', '');
          const imageSplit = imageKey.split('/');
          const wallpaperData: Wallpaper = {
            url: parallaxUrls,
            type: imageSplit[0],
            subtype: imageSplit[1],
            name: imageSplit[0] + imageSplit[1],
          };
          allWallpapers.push(wallpaperData);
        }
        await wallpaper.updateWallpaperDocument(allWallpapers);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export default new WallpapersJobs();
