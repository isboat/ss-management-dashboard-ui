import { Component, input, signal } from '@angular/core';
import { HistoryModel } from 'app/models/history-response.model';
import { AuthService } from 'app/services/auth.service';
import { HistoryService } from 'app/services/history.service';

@Component({
  standalone: false,
  selector: 'item-history',
  templateUrl: './item-history.component.html',
  styleUrls: ['./item-history.component.css']
})
export class ItemHistoryComponent {
  readonly itemId = input<string>();
  readonly histories = signal<HistoryModel[]>([]);

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,) { }

  viewHistory() {
    const itemId = this.itemId();
    if(!itemId) return;

    this.historyService.fetchDetails(itemId).subscribe({
      next: (data) => {
        this.histories.set(data);
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
