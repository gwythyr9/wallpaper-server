import * as schedule from 'node-schedule';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { Container } from 'typedi';
import { WallpaperService } from '@services/wallpapers.service';
import { Wallpaper } from '@interfaces/wallpapers.interface';

class WallpapersJobs {
  public refreshUrls() {
    schedule.scheduleJob('*/240 * * * *', async () => {
      const REGION = 'us-east-1';
      const BUCKET = 'wallpapersapp';
      const client = new S3Client({
        endpoint: 'https://sfo3.digitaloceanspaces.com',
        region: REGION,
        credentials: {
          accessKeyId: 'DO00WR3YRMTC42HKG2XN',
          secretAccessKey: 'Gvqv/EuDiw0new4iV2MPMz1oonTxo7fjKW4W+wVoDVM',
        },
      });
      const getListOfVideo = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'video/video',
        MaxKeys: 1000,
      });
      const getListOfImage = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'image',
        MaxKeys: 1000,
      });
      const getListOfTheme = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'theme/theme',
        MaxKeys: 1000,
      });
      const getListOfParallaxFolders = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: 'parallax/',
        Delimiter: '/',
        MaxKeys: 1000,
      });
      const wallpaper = Container.get(WallpaperService);
      const allWallpapers: Wallpaper[] = [];
      try {
        const { Contents: theme } = await client.send(getListOfTheme);
        theme.shift();
        for (const imageTheme of theme) {
          const imageKey = imageTheme.Key.replace('wallpapersapp/', '');
          const imageSplit = imageKey.split('/');
          const wallpaperData: Wallpaper = {
            url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${imageTheme.Key}`],
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
          const videoKey = video.Key.replace('wallpapersapp/', '');
          const videoSplit = videoKey.split('/');
          const wallpaperData: Wallpaper = {
            url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${video.Key}`],
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
          const imageKey = image.Key.replace('wallpapersapp/', '');
          const imageSplit = imageKey.split('/');
          const wallpaperData: Wallpaper = {
            url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${image.Key}`],
            type: 'image',
            subtype: imageSplit[1],
            name: imageSplit[2],
          };
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
          const parallaxUrls = parallaxFiles.map(u => `https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${u.Key}`);
          const imageKey = folder.replace('wallpapersapp/', '');
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
  public async refreshUrlsInit() {
    const REGION = 'us-east-1';
    const BUCKET = 'wallpapersapp';
    const client = new S3Client({
      endpoint: 'https://sfo3.digitaloceanspaces.com',
      region: REGION,
      credentials: {
        accessKeyId: 'DO00WR3YRMTC42HKG2XN',
        secretAccessKey: 'Gvqv/EuDiw0new4iV2MPMz1oonTxo7fjKW4W+wVoDVM',
      },
    });
    const getListOfVideo = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'video/video',
      MaxKeys: 1000,
    });
    const getListOfImage = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'image',
      MaxKeys: 1000,
    });
    const getListOfTheme = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'theme/theme',
      MaxKeys: 1000,
    });
    const getListOfParallaxFolders = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: 'parallax/',
      Delimiter: '/',
      MaxKeys: 1000,
    });
    const wallpaper = Container.get(WallpaperService);
    const allWallpapers: Wallpaper[] = [];
    try {
      const { Contents: theme } = await client.send(getListOfTheme);
      theme.shift();
      for (const imageTheme of theme) {
        const imageKey = imageTheme.Key.replace('wallpapersapp/', '');
        const imageSplit = imageKey.split('/');
        const wallpaperData: Wallpaper = {
          url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${imageTheme.Key}`],
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
        const videoKey = video.Key.replace('wallpapersapp/', '');
        const videoSplit = videoKey.split('/');
        const wallpaperData: Wallpaper = {
          url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${video.Key}`],
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
        const imageKey = image.Key.replace('wallpapersapp/', '');
        const imageSplit = imageKey.split('/');
        const wallpaperData: Wallpaper = {
          url: [`https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${image.Key}`],
          type: 'image',
          subtype: imageSplit[1],
          name: imageSplit[2],
        };
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
        const parallaxUrls = parallaxFiles.map(u => `https://wallpapersapp.sfo3.cdn.digitaloceanspaces.com/${u.Key}`);
        const imageKey = folder.replace('wallpapersapp/', '');
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
  }
}

export default new WallpapersJobs();
