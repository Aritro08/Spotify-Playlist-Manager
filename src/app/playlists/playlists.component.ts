import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Playlists } from '../models/playlists.model';
import { Subscription } from 'rxjs';
import { PlaylistService } from './playlist.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit, OnDestroy {

  playlists: Playlists[];
  playlistSub: Subscription;
  trackUri: string;
  embedUrl: SafeResourceUrl;
  player = false;
  playing = false;
  imageUrl: string;
  trackName: string;
  trackArtists: Array<string>;

  constructor(private playlistService: PlaylistService, private authService: AuthService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.authService.fetchInitData();
    this.playlistService.fetchPlaylists();
    this.playlistSub = this.playlistService.playlistsSub.subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  onViewPlaylist(id: string, name: string, tracks: number) {
    this.playlistService.fetchPlaylist(id, name, tracks);
  }

  playTrack(event: any) {
    this.player = true;
    this.playing = true;
    // this.trackUri = uri.slice(14);
    // this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://open.spotify.com/embed/track/${this.trackUri}`);
    this.imageUrl = event.image;
    this.trackName = event.name;
    this.trackArtists = event.artists;
  }

  togglePlay() {
    this.playing = !this.playing;
    let deviceId = localStorage.getItem('deviceId');
    if(this.playing == false) {
      //pause track
      this.playerService.pauseTrack(deviceId);
    } else {
      //resume track
      this.playerService.resumeTrack(deviceId);
    }
  }

  ngOnDestroy() {
    this.playlistSub.unsubscribe();
  }

}
