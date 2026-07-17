import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AssetModel } from 'app/models/asset-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  constructor(private http: HttpClient) { }

  fetchMediaAssets(skip?: number, limit?: number, assetType?: number): Observable<AssetModel[]>  {
    let url = environment.apiBaseUrl + '/v1/tenant/media-assets?';
    if(skip) url += `skip=${skip}&`;
    if(limit) url += `limit=${limit}&`;
    if(assetType) url += `assetType=${assetType}`;

    return this.http.get<AssetModel[]>(
       url,
      { responseType: 'json' }
    );
  }

  fetchMediaAsset(id: string): Observable<AssetModel>  {
    return this.http.get<AssetModel>(
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
