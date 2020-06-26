import { Component, OnInit, OnDestroy } from '@angular/core';
import { Track } from 'src/app/models/track.model';
import { Subscription } from 'rxjs';
import { PlaylistService } from '../playlist.service';
import { PlayerService } from 'src/app/player.service';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit, OnDestroy {

  tracks: Track[];
  PlName: string;
  trackSub: Subscription;
  PlNameSub: Subscription;

  constructor(private playlistService: PlaylistService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.trackSub = this.playlistService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
    });
    this.PlNameSub = this.playlistService.playlistNameSub.subscribe(name => {
      this.PlName = name;
    })
  }

  playTrack(uri: string) {
    this.playerService.playTrackUri(uri);
  }

  ngOnDestroy() {
    this.trackSub.unsubscribe();
  }

}
