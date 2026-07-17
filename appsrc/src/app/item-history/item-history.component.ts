import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HistoryModel } from 'app/models/history-response.model';
import { AuthService } from 'app/services/auth.service';
import { HistoryService } from 'app/services/history.service';

@Component({
  selector: 'item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.css']
})
export class ItemHistoryComponent implements OnInit, OnDestroy {
  @Input() itemId: string;
  histories: HistoryModel[] = [];

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
  
  viewHistory() {
    if(!this.itemId) return;

    this.historyService.fetchDetails(this.itemId).subscribe({
      next: (data) => {
        this.histories = data
      },
      error: (e) => {
        if (e.status == 401) this.authService.redirectToLogin(true);
      }
    });
  }
  toDate(str){
    return Date.parse(str);
  }
}
