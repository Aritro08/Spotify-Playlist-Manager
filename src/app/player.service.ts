import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({'providedIn': 'root'})

export class PlayerService {

  constructor(private http: HttpClient) {}

  playTrack(id: string, uri: string) {
    this.http.put('http://localhost:3000/playlists/playlist/track/', { deviceId: id, uri: uri }).subscribe();
  }

  pauseTrack(id: string) {
    this.http.put('http://localhost:3000/playlists/playlist/track/pause', { deviceId: id}).subscribe();
  }

  resumeTrack(id: string) {
    this.http.put('http://localhost:3000/playlists/playlist/track/resume', { deviceId: id }).subscribe();
  }

}
