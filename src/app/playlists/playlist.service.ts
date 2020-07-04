import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
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
  playlistDetailSub = new Subject<{id: string, name: string, tracks: number}>();
  navElements = new Subject<number>();

  fetchPlaylists() {
    this.http.get<{playlistsData: Playlists[]}>('http://localhost:3000/playlists/playlist').subscribe(res => {
      this.playlists = res.playlistsData;
      this.playlistsSub.next(this.playlists.slice());
      this.navElements.next(1);
    });
  }

  fetchPlaylist(id: string, Plname: string, tracks: number) {
    this.http.get<{tracks: Track[]}>('http://localhost:3000/playlists/playlist/' + id).subscribe(res => {
      this.tracks = res.tracks;
      this.tracksSub.next(this.tracks.slice());
    });
    this.playlistDetailSub.next({id: id, name: Plname, tracks: tracks});
  }

  createPlaylist(name: string, uri:string) {
    this.http.post<{playlistId: string}>('http://localhost:3000/playlists/playlist/new', { name: name }).subscribe(res => {
      this.addTrackToPlaylist(res.playlistId, uri);
    });
  }

  addTrackToPlaylist(id: string, uri: string) {
    this.http.post('http://localhost:3000/playlists/playlist/' + id, { trackUri: uri }).subscribe(res => {
      this.fetchPlaylists();
    });
  }

  deleteTrack(id: string, uri: string, name: string, tracks: number) {
    this.http.delete('http://localhost:3000/playlists/playlist/' + id + '/' + uri).subscribe(res => {
      this.fetchPlaylists();
      this.fetchPlaylist(id, name, tracks);
    });
  }
}
