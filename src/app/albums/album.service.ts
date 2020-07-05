import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Track } from '../models/track.model';
import { Subject } from 'rxjs';

@Injectable({'providedIn':'root'})

export class AlbumService {

  tracks: Track[];
  albumDetailsSub = new Subject<{tracks: Track[], name: string, artists: Array<string>, image: string, date: string}>();

  constructor(private http: HttpClient) {}

  getAlbumTracks(id: string, name: string, artists: Array<string>, image: string, date: string) {
    this.http.get<{tracks: Track[]}>('http://localhost:3000/search/album/' + id).subscribe(trackData => {
      this.tracks = trackData.tracks;
      this.albumDetailsSub.next({tracks: this.tracks.slice(), name: name, artists: artists, image: image, date: date });
    });
  }

}
