import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ScreenModel } from 'app/models/screen-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  fetchScreens(): Observable<ScreenModel[]>  {
    return this.http.get<ScreenModel[]>(
      environment.apiBaseUrl + '/v1/tenant/screens',
      { responseType: 'json' }
    );
  }
}
