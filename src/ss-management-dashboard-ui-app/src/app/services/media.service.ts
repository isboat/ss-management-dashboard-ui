import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaAssetModel } from 'app/models/media-asset-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  fetchMenus(): Observable<MediaAssetModel[]>  {
    return this.http.get<MediaAssetModel[]>(
      environment.apiBaseUrl + '/v1/tenant/media-assets',
      { responseType: 'json' }
    );
  }

  upload(data: FormData): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/media-asset/upload/',
      data,
      { responseType: 'json' }
    );
  }
}
