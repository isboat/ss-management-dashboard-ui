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

  fetchMediaAssets(): Observable<MediaAssetModel[]>  {
    return this.http.get<MediaAssetModel[]>(
      environment.apiBaseUrl + '/v1/tenant/media-assets',
      { responseType: 'json' }
    );
  }

  fetchMediaAsset(id: string): Observable<MediaAssetModel>  {
    return this.http.get<MediaAssetModel>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/' + id,
      { responseType: 'json' }
    );
  }

  postNew(data: FormData): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/',
      data,
      { responseType: 'json' }
    );
  }

  addMediaToPlaylist(mediaId: string, playlistId: string): Observable<any>  {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/' + mediaId + '/playlist/' + playlistId,
      { responseType: 'json' }
    );
  }

  removeMediaPlaylist(mediaId: string, playlistId: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/' + mediaId + '/playlist/' + playlistId,
      { responseType: 'json' }
    );
  }

  deleteMedia(id: string): Observable<any> {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/' + id,
      { responseType: 'json' }
    );
  }

  updateMediaName(id: string, name: string): Observable<any> {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/media-assets/' + id + '/name/' + name,
      { responseType: 'json' }
    );
  }
}
