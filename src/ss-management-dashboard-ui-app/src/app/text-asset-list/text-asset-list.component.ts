import { Component, OnInit } from '@angular/core';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { TextAssetService } from 'app/services/text-asset.service';
import { PlaylistService } from 'app/services/playlist.service';
import { TextAssetModel } from 'app/models/text-asset-response.model';

@Component({
  selector: 'app-text-asset-list',
  templateUrl: './text-asset-list.component.html',
  styleUrls: ['./text-asset-list.component.css']
})
export class TextAssetListComponent implements OnInit {

  listData: TextAssetModel[] = null;
  playlists: PlaylistModel[] = [];

  constructor(
    private dataService: TextAssetService, 
    private authService: AuthService,
    private playlistService: PlaylistService) { }

  ngOnInit() {
    this.fetchListData();
    this.fetchPlaylists();
  }

  playlistContainTextIds(pl: PlaylistModel, id: string): boolean
  {
    if(!pl.itemIdAndTypePairs || !id) return false;
    return pl.itemIdAndTypePairs.findIndex(x => x.id === id) > -1;
  }

  updatePlaylist(evt: any, id: string) {
    const playlistId = evt.target.value;
    if(!playlistId || !id) return;

    if(playlistId == "none")
    {
      var playlist = this.playlists.find(x => x.itemIdAndTypePairs.findIndex(x => x.id === id) > -1);
      if(playlist)
      {
        this.removeTextPlaylist(id, playlist.id)
      }
    }
    else
    {
      this.addTextToPlaylist(id, playlistId)
    }

  }

  addTextToPlaylist(id, playlistId)
  {
    this.dataService.addTextToPlaylist(id, playlistId).subscribe(
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

  removeTextPlaylist(id: string, playlistId: string)
  {
    this.dataService.removeTextPlaylist(id, playlistId).subscribe(
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

  fetchListData(){
    this.dataService.fetchTextAssets().subscribe(
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

 deleteText(id: string)
 {
  this.dataService.deleteText(id).subscribe(
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
