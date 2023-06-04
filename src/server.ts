import { App } from '@/app';
import { WallpaperRoute } from '@routes/wallpapers.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new WallpaperRoute()]);

app.listen();
