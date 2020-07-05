import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlbumService } from '../album.service';
import { Subscription } from 'rxjs';
import { Track } from 'src/app/models/track.model';
import { PlaylistService } from 'src/app/playlists/playlist.service';
import { Playlists } from 'src/app/models/playlists.model';

@Component({
  selector: 'app-album-tracks',
  templateUrl: './album-tracks.component.html',
  styleUrls: ['./album-tracks.component.css']
})
export class AlbumTracksComponent implements OnInit, OnDestroy {

  albumSub: Subscription;
  playlistSub: Subscription;
  tracks: Track[];
  playlists: Playlists[];
  numTracks: number;
  trackUri: string;
  albumName: string;
  artists: string[];
  imageUrl: string;
  relDate: string;
  dispForm = false;

  constructor(private albumService: AlbumService, private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.albumSub = this.albumService.albumDetailsSub.subscribe(res => {
      this.tracks = res.tracks;
      this.albumName = res.name;
      this.artists = res.artists;
      this.imageUrl = res.image;
      this.relDate = res.date;
      this.numTracks = this.tracks.length;
    });
    this.playlistService.fetchPlaylists();
    this.playlistSub = this.playlistService.playlistsSub.subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  addTrack(id: string, uri: string) {
    this.playlistService.addTrackToPlaylist(id, uri);
  }

  showForm(uri: string) {
    this.trackUri = uri;
    this.dispForm = true;
  }

  closeForm() {
    this.dispForm = false;
  }

  ngOnDestroy() {
    this.albumSub.unsubscribe();
    this.playlistSub.unsubscribe();
  }

}
