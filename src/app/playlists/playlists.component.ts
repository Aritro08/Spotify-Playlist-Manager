import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Playlists } from '../models/playlists.model';
import { Subscription } from 'rxjs';
import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit, OnDestroy {

  playlists: Playlists[];
  playlistSub: Subscription;

  constructor(private playlistService: PlaylistService, private authService: AuthService) { }

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

  ngOnDestroy() {
    this.playlistSub.unsubscribe();
  }

}
