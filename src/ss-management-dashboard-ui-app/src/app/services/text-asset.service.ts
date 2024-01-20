import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextAssetModel } from 'app/models/text-asset-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextAssetService {

  constructor(private http: HttpClient) { }

  fetchTextAssets(): Observable<TextAssetModel[]>  {
    return this.http.get<TextAssetModel[]>(
      environment.apiBaseUrl + '/v1/tenant/text-assets',
      { responseType: 'json' }
    );
  }

  fetchTextAsset(id: string): Observable<TextAssetModel>  {
    return this.http.get<TextAssetModel>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/' + id,
      { responseType: 'json' }
    );
  }

  postNew(data:any): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/',
      data,
      { responseType: 'json' }
    );
  }

  addTextToPlaylist(mediaId: string, playlistId: string): Observable<any>  {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/' + mediaId + '/playlist/' + playlistId,
      { responseType: 'json' }
    );
  }

  removeTextPlaylist(mediaId: string, playlistId: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/' + mediaId + '/playlist/' + playlistId,
      { responseType: 'json' }
    );
  }

  deleteText(id: string): Observable<any> {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/' + id,
      { responseType: 'json' }
    );
  }

  update(data: TextAssetModel): Observable<any> {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/text-assets/' + data.id,
      data,
      { responseType: 'json' }
    );
  }
}
