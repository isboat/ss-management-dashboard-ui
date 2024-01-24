import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetModel } from 'app/models/asset-response.model';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  selector: 'app-media-details',
  templateUrl: './media-details.component.html',
  styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent implements OnInit {
  id: string;
  private sub: any;
  data: AssetModel = null;
  previewWidth: string = "500px";
  playlists: PlaylistModel[] = [];

  constructor(
    private dataService: MediaService, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationsService,
    private playlistService: PlaylistService) { }

  ngOnInit() {
    

    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
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
      var playlist = this.playlists.find(x => x.itemIdAndTypePairs.findIndex(x => x.id === mediaId) > -1);
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
        next: (data) => this.playlists = data,
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

  fetchData(){
    if(!this.id) return;
    this.dataService.fetchMediaAsset(this.id).subscribe(
      {
        next: (data) => this.data = data,
        error: (e) => {
          if(e.status == 401) 
          {
            this.authService.redirectToLogin(true);
          }
          else
          {
            console.log(e)
          }
        }
      });
 }

 deleteMedia(id: string)
 {
  this.dataService.deleteMedia(id).subscribe(
    {
      next: () => 
      {
        this.router.navigate(['/media-list']);
      },
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

 saveName() {
  this.dataService.updateMediaName(this.data.id, this.data.name).subscribe(
    {
      next: () => 
      {
        this.notificationService.showSuccess("Name updated");
      },
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
    });
 }

}
