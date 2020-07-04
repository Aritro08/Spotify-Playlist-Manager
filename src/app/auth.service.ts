import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({'providedIn': 'root'})

export class AuthService {

  constructor(private http: HttpClient) {}

  userName: string;
  userNameSub = new Subject<string>();

  fetchInitData() {
    this.http.get<{accessToken:string, expiresIn: number, userName: string, userId: string}>('http://localhost:3000/playlists/init').subscribe(res => {
      if(res) {
        this.storeData(res.accessToken, res.userId);
        this.userName = res.userName.split(' ')[0];
        this.userNameSub.next(this.userName);
      }
    });
  }

  private storeData(accessToken: string, userId: string) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('userId', userId);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('userId');
  }
}
