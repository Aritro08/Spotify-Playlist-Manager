import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Track } from '../models/track.model';
import { Album } from '../models/albums.model';
import { Subject } from 'rxjs';

@Injectable({'providedIn':'root'})

export class SearchService {
  constructor(private http: HttpClient) {}

  tracks: Track[];
  albums: Album[];
  tracksSub = new Subject<Track[]>();
  albumsSub = new Subject<Album[]>();

  searchQuery(query: string) {
    this.http.get<{queryTracks: Track[], queryAlbums: Album[]}>('http://localhost:3000/search/' + query).subscribe(resData => {
      this.tracks = resData.queryTracks;
      this.albums = resData.queryAlbums;
      this.tracksSub.next(this.tracks.slice());
      this.albumsSub.next(this.albums.slice());
    });
  }

}
