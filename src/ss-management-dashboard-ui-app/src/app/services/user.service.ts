import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from 'app/models/user-response.model';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchUsers(): Observable<UserModel[]>  {
    return this.http.get<UserModel[]>(
      environment.apiBaseUrl + '/v1/tenant/users',
      { responseType: 'json' }
    );
  }

  fetchUserDetails(id: string): Observable<UserModel>  {
    return this.http.get<UserModel>(
      environment.apiBaseUrl + '/v1/tenant/users/' + id,
      { responseType: 'json' }
    );
  }

  createNewUser(data: UserModel): Observable<any>  {
    return this.http.post<any>(
      environment.apiBaseUrl + '/v1/tenant/users/',
      data,
      { responseType: 'json' }
    );
  }

  saveUser(data: UserModel): Observable<any>  {
    return this.http.patch<any>(
      environment.apiBaseUrl + '/v1/tenant/users/',
      JSON.stringify(data),
      { responseType: 'json' }
    );
  }

  deleteUser(id: string): Observable<any>  {
    return this.http.delete<any>(
      environment.apiBaseUrl + '/v1/tenant/users/' + id,
      { responseType: 'json' }
    );
  }
}
