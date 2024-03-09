import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlaylistModel, PlaylistWithItemsModel } from 'app/models/playlist-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  constructor(private http: HttpClient) { }

  fetchPlaylists(): Observable<PlaylistModel[]>  {
    return this.http.get<PlaylistModel[]>(
      environment.apiBaseUrl + '/v1/tenant/playlists',
      { responseType: 'json' }
    );
  }

  fetchDetails(id: string): Observable<PlaylistWithItemsModel>  {
    return this.http.get<PlaylistWithItemsModel>(
      environment.apiBaseUrl + '/v1/tenant/playlists/' + id,
      { responseType: 'json' }
    );
  }

  createNew(data: PlaylistModel): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/playlists/',
      data,
      { responseType: 'json' }
    );
  }

  save(data: PlaylistModel): Observable<any>  {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/playlists/'+data.id,
      JSON.stringify(data),
      { responseType: 'json', headers: headers }
    );
  }

  publishRelatedScreens(id: string): Observable<any>  {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/playlists/'+ id + 'publish-related-screens',
      null,
      { responseType: 'json', headers: headers }
    );
  }

  delete(id: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/playlists/' + id,
      { responseType: 'json' }
    );
  }
}
