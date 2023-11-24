import { Component, OnInit } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { DataService } from 'app/services/data.service';
import { AuthService } from 'app/services/auth.service';
import { NotificationsService } from 'app/notifications';

@Component({
  selector: 'app-screen-list',
  templateUrl: './screen-list.component.html',
  styleUrls: ['./screen-list.component.css']
})
export class ScreenListComponent implements OnInit {

  listData: ScreenModel[] = null;

  constructor(private dataService: DataService, private authService: AuthService, private notification: NotificationsService) { }

  ngOnInit() {
    this.fetchListData();
  }

  fetchListData() {
    this.dataService.fetchScreens().subscribe(
      {
        next: (data) => this.listData = data,
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  goToPreviewSite(screenId: string) {
    window.open(`http://localhost:4401/?screenId=${screenId}&token=${this.authService.getAuthorizationToken()}`, "newwindow", 'width=1100,height=850');
  } 

  publishScreen(id: string) {
    this.dataService.publishScreen(id).subscribe(
      {
        next: () => {
          this.notification.showSuccess("PUBLISHED..")
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

  deleteScreen(id: string) {
    this.dataService.deleteScreen(id).subscribe(
      {
        next: () => {
          this.listData.forEach((value, index) => {
            if (value.id == id) this.listData.splice(index, 1);
          });
        },
        error: (e) => {
          if (e.status == 401) {
            this.authService.redirectToLogin(true);
          }
          else {
            console.log(e)
          }
        },
        complete: () => console.info('complete')
      });
  }

}
