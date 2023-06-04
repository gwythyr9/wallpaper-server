import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateWallpaperDto {
  @IsString()
  @IsNotEmpty()
  public type: string;

  @IsUrl()
  @IsNotEmpty()
  public url: string;
}

export class UpdateWallpaperDto {
  @IsString()
  @IsNotEmpty()
  public type: string;

  @IsUrl()
  @IsNotEmpty()
  public url: string;
}
