import { Component, OnInit } from '@angular/core';
import { PlaylistModel } from 'app/models/playlist-response.model';
import { NotificationsService } from 'app/notifications';
import { AuthService } from 'app/services/auth.service';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  selector: 'help-support',
  templateUrl: './help-support.component.html',
  styleUrls: ['./help-support.component.css']
})
export class HelpSupportComponent implements OnInit {

  constructor(private notificationService: NotificationsService) { }

  ngOnInit() {
  }
}
