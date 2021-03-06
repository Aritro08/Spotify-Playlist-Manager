import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Track } from 'src/app/models/track.model';
import { Subscription } from 'rxjs';
import { PlaylistService } from '../playlist.service';
import { PlayerService } from 'src/app/player.service';
import { Playlists } from 'src/app/models/playlists.model';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.css']
})
export class TracksComponent implements OnInit, OnDestroy {

  tracks: Track[];
  trackUri: string;
  @Input() playlists: Playlists[];
  PlName: string;
  PlId: string;
  tracksNum: number;
  trackSub: Subscription;
  PlDetailSub: Subscription;
  dispForm = false;
  @Output() playTrack = new EventEmitter<{name: string, artists: Array<string>, image: string}>();

  constructor(private playlistService: PlaylistService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.trackSub = this.playlistService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
    });
    this.PlDetailSub = this.playlistService.playlistDetailSub.subscribe(res => {
      this.PlName = res.name;
      this.PlId = res.id;
      this.tracksNum = res.tracks;
    });
  }

  onPlayTrack(uri: string, image: string, name: string, artists: Array<string>) {
    let deviceId = localStorage.getItem('deviceId');
    this.playerService.playTrack(deviceId, uri);
    this.playTrack.emit({name: name, artists: artists, image: image});
  }

  addTrack(id: string, uri: string) {
    this.playlistService.addTrackToPlaylist(id, uri);
  }

  delTrack(id: string, uri: string) {
    this.playlistService.deleteTrack(id, uri, this.PlName, this.tracksNum-1);
  }

  showForm(uri: string){
    this.dispForm = true;
    this.trackUri = uri;
  }

  closeForm(){
    this.dispForm = false;
  }

  ngOnDestroy() {
    this.trackSub.unsubscribe();
    this.PlDetailSub.unsubscribe();
  }
}
