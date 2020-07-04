import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({'providedIn': 'root'})

export class PlayerService {

  constructor(private http: HttpClient) {}

  // playTrackUri(uri: string) {
  //   this.http.get('http://localhost:3000/playlists/playlist/track/' + uri).subscribe();
  // }

}
