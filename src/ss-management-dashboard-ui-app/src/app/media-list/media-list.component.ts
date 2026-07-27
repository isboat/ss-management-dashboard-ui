import { Component, OnInit, signal } from '@angular/core';
import { AssetModel } from 'app/models/asset-response.model';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  standalone: false,
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  readonly listData = signal<AssetModel[]>([]);
  readonly playlists = signal<PlaylistModel[]>([]);
  readonly loading = signal(false);
  readonly deletingId = signal<string | null>(null);
  readonly fetchLimit = 20;

  constructor(
    private dataService: MediaService, 
    private authService: AuthService,
    private playlistService: PlaylistService) { }

  ngOnInit() {
    this.fetchListData();
    this.fetchPlaylists();
  }

  IsVideoAsset(assetType: number): boolean
  {
    return assetType == 2; // 1= image, 2=video 
  }

  playlistContainMediaIds(pl: PlaylistModel, mediaId: string): boolean
  {
    if(!pl.itemIdAndTypePairs || !mediaId) return false;
    return pl.itemIdAndTypePairs.findIndex(x => x.id == mediaId) > -1;
  }

  updatePlaylist(evt: any, mediaId: string) {
    const playlistId = evt.target.value;
    if(!playlistId || !mediaId) return;

    if(playlistId == "none")
    {
      const playlist = this.playlists().find(x => x.itemIdAndTypePairs.findIndex(x => x.id == mediaId) > -1);
      if(playlist)
      {
        this.removeMediaPlaylist(mediaId, playlist.id)
      }
    }
    else
    {
      this.addMediaToPlaylist(mediaId, playlistId)
    }

  }

  addMediaToPlaylist(mediaId, playlistId)
  {
    this.dataService.addMediaToPlaylist(mediaId, playlistId).subscribe(
      {
        next: () => {},
        error: (e) => {
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }
  removeMediaPlaylist(mediaId: string, playlistId: string)
  {
    this.dataService.removeMediaPlaylist(mediaId, playlistId).subscribe(
      {
        next: () => {},
        error: (e) => {
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  fetchPlaylists()
  {
    this.playlistService.fetchPlaylists().subscribe(
      {
        next: (data) => this.playlists.set(data),
        error: (e) => {
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  fetchListData(){
    if (this.loading()) return;
    this.loading.set(true);
    this.dataService.fetchMediaAssets(this.listData().length, this.fetchLimit).subscribe(
      {
        next: (data) => this.listData.update(items => [...items, ...data]),
        error: (e) => {
          this.loading.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.loading.set(false)
      });
 }

 deleteMedia(id: string)
 {
  this.deletingId.set(id);
  this.dataService.deleteMedia(id).subscribe(
    {
      next: () => 
      {
        this.listData.update(items => items.filter(item => item.id !== id));
        this.deletingId.set(null);
      },
      error: (e) => {
        this.deletingId.set(null);
        if(e.status == 401) 
        {
          this.authService.redirectToLogin(true);
        }
        else
        {
          console.log(e)
        }
      },
      complete: () => console.info('complete')
    });
 }

}
