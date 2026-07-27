import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetModel } from 'app/models/asset-response.model';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  standalone: false,
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent implements OnInit {
  readonly id = signal('');
  private sub: any;
  readonly data = signal<AssetModel | null>(null);
  readonly playlists = signal<PlaylistModel[]>([]);
  readonly loading = signal(false);
  readonly loadingPlaylists = signal(false);
  readonly savingName = signal(false);
  readonly deleting = signal(false);
  readonly updatingPlaylist = signal(false);
  readonly previewWidth = "500px";

  constructor(
    private dataService: MediaService, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private playlistService: PlaylistService) { }

  ngOnInit() {
    

    this.sub = this.route.params.subscribe(params => {
      this.id.set(params['id']);
      this.fetchData();
    });

    this.fetchPlaylists();
  }

  IsVideoAsset(assetType: number): boolean
  {
    return assetType == 2; // 1= image, 2=video 
  }

  playlistContainMediaIds(pl: PlaylistModel, mediaId: string): boolean
  {
    if(!pl.itemIdAndTypePairs || !mediaId) return false;
    return pl.itemIdAndTypePairs.findIndex(x => x.id === mediaId) > -1;
  }

  updatePlaylist(evt: any, mediaId: string) {
    const playlistId = evt.target.value;
    if(!playlistId || !mediaId) return;

    if(playlistId == "none")
    {
      const playlist = this.playlists().find(x => x.itemIdAndTypePairs?.findIndex(x => x.id === mediaId) > -1);
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
    this.updatingPlaylist.set(true);
    this.dataService.addMediaToPlaylist(mediaId, playlistId).subscribe(
      {
        next: () => {},
        error: (e) => {
          this.updatingPlaylist.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.updatingPlaylist.set(false)
      });
  }

  removeMediaPlaylist(mediaId: string, playlistId: string)
  {
    this.updatingPlaylist.set(true);
    this.dataService.removeMediaPlaylist(mediaId, playlistId).subscribe(
      {
        next: () => {},
        error: (e) => {
          this.updatingPlaylist.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.updatingPlaylist.set(false)
      });
  }

  fetchPlaylists()
  {
    this.loadingPlaylists.set(true);
    this.playlistService.fetchPlaylists().subscribe(
      {
        next: (data) => this.playlists.set(data),
        error: (e) => {
          this.loadingPlaylists.set(false);
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        },
        complete: () => this.loadingPlaylists.set(false)
      });
  }

  fetchData(){
    if(!this.id()) return;
    this.loading.set(true);
    this.dataService.fetchMediaAsset(this.id()).subscribe(
      {
        next: (data) => this.data.set(data),
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
  this.deleting.set(true);
  this.dataService.deleteMedia(id).subscribe(
    {
      next: () => 
      {
        this.router.navigate(['/media-list']);
      },
      error: (e) => {
        this.deleting.set(false);
        if(e.status == 401) 
        {
          this.authService.redirectToLogin(true);
        }
        else
        {
          console.log(e)
        }
      },
      complete: () => this.deleting.set(false)
    });
 }

 saveName() {
  const data = this.data();
  if (!data) return;
  this.savingName.set(true);
  this.dataService.updateMediaName(data.id, data.name).subscribe(
    {
      next: () => 
      {
        this.notificationService.showSuccess("Name updated");
        this.data.update(asset => asset ? { ...asset, editName: false } : asset);
      },
      error: (e) => {
        this.savingName.set(false);
        if(e.status == 401) 
        {
          this.authService.redirectToLogin(true);
        }
        else
        {
          console.log(e)
        }
      },
      complete: () => this.savingName.set(false)
    });
 }

 setMediaName(name: string): void {
  this.data.update(asset => asset ? { ...asset, name } : asset);
 }

 enableNameEditing(): void {
  this.data.update(asset => asset ? { ...asset, editName: true } : asset);
 }

}
