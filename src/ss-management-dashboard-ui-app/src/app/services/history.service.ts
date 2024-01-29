import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistoryModel } from 'app/models/history-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }

  fetchDetails(id: string): Observable<HistoryModel[]>  {
    return this.http.get<HistoryModel[]>(
      environment.apiBaseUrl + '/v1/tenant/history/' + id,
      { responseType: 'json' }
    );
  }
}
