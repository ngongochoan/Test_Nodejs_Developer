import { Module, forwardRef } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { FavoriteModule } from '../favorite/favorite.module';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
  imports: [
    forwardRef(() => TrackModule),
    forwardRef(() => FavoriteModule),
    forwardRef(() => AlbumModule),
  ],
})
export class ArtistModule {}
