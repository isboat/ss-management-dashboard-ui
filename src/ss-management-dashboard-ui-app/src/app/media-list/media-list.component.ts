import { Component, OnInit } from '@angular/core';
import { MediaAssetModel } from 'app/models/media-asset-response.model';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { MediaService } from 'app/services/media.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  selector: 'app-media-list',
  templateUrl: './media-list.component.html',
  styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {

  listData: MediaAssetModel[] = null;
  playlists: PlaylistModel[] = [];

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

  fetchListData(){
    this.dataService.fetchMediaAssets().subscribe(
      {
        next: (data) => this.listData = data,
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

 deleteMedia(id: string)
 {
  this.dataService.deleteMedia(id).subscribe(
    {
      next: () => 
      {
        this.listData.forEach((value,index)=>{
          if(value.id==id) this.listData.splice(index,1);
        });
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

}
