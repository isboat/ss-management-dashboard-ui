import { Component, OnInit } from '@angular/core';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  listData: PlaylistModel[] = null;
  newItem: PlaylistModel = {
    name: '',
    created: null,
    modifiedDate: null,
    id: '',
    tenantId: '',
  };

  constructor(private playlistService: PlaylistService, private authService: AuthService) { }

  ngOnInit() {
    this.fetchListData();
  }

  addNewItem()
  {
    if(this.newItem.name)
    {
      this.playlistService.createNew(this.newItem).subscribe(
        {
          next: (data) => 
          {
            this.fetchListData();
            this.newItem.name = '';
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
          }
        });
    }
  }

  saveItem(item: PlaylistModel)
  {
    if(item)
    {
      this.playlistService.save(item).subscribe(
        {
          next: (data) => {},
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
  }

  fetchListData(){
    this.playlistService.fetchPlaylists().subscribe(
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
        }
      });
 }

 deletePlaylist(id: string)
 {
  this.playlistService.delete(id).subscribe(
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
      }
    });
 }
}
