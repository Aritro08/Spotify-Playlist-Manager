import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Track } from '../models/track.model';
import { Playlists } from '../models/playlists.model';
import { Subject, Subscription } from 'rxjs';

@Injectable({providedIn: 'root'})

export class PlaylistService {

  constructor(private http: HttpClient) {}

  playlists: Playlists[];
  tracks: Track[];
  playlistsSub = new Subject<Playlists[]>();
  tracksSub = new Subject<Track[]>();
  playlistNameSub = new Subject<string>();
  navElements = new Subject<number>();

  fetchPlaylists() {
    this.http.get<{playlistsData: Playlists[]}>('http://localhost:3000/playlists/playlist').subscribe(res => {
      this.playlists = res.playlistsData;
      this.playlistsSub.next(this.playlists.slice());
      this.navElements.next(1);
    });
  }

  fetchPlaylist(id: number, Plname: string) {
    this.http.get<{tracks: Track[]}>('http://localhost:3000/playlists/playlist/' + id).subscribe(res => {
      this.tracks = res.tracks;
      this.tracksSub.next(this.tracks.slice());
    });
    this.playlistNameSub.next(Plname);
  }
}
