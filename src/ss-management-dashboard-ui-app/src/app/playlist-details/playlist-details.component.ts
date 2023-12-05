import { Component, OnInit } from '@angular/core';
import { PlaylistModel, PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-playlist-details',
  templateUrl: './playlist-details.component.html',
  styleUrls: ['./playlist-details.component.css']
})
export class PlaylistComponent implements OnInit {
  id: string;
  private sub: any;
  data: PlaylistWithItemsModel = null

  constructor(private playlistService: PlaylistService, private authService: AuthService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.fetchData();
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.fetchData();
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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

  fetchData(){
    this.playlistService.fetchDetails(this.id).subscribe(
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
}
