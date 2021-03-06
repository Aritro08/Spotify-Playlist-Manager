import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service'
import { Track } from '../models/track.model';
import { Subscription } from 'rxjs';
import { Playlists } from '../models/playlists.model';
import { PlaylistService } from '../playlists/playlist.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery: string;
  trackUri: string;
  trackDetail: {name: string, image: string, artists: Array<string>};
  playlists: Playlists[];
  tracks: Track[];
  subTracks: Subscription;
  subPlaylists: Subscription;
  dispForm = false;
  dispPlayer = false;

  constructor(private searchService: SearchService,
              private playlistService: PlaylistService,
              private route: ActivatedRoute,
              private router: Router,
              private playerService: PlayerService) { }

  ngOnInit(): void {
    this.subTracks = this.searchService.tracksSub.subscribe(tracks => {
      this.tracks = tracks;
    });
    this.playlistService.fetchPlaylists();
    this.subPlaylists = this.playlistService.playlistsSub.subscribe(playlists => {
      this.playlists = playlists;
    });
  }

  addTrack(id: string, uri: string) {
    this.playlistService.addTrackToPlaylist(id, uri);
  }

  runSearch() {
    this.router.navigate(['/search'], {relativeTo: this.route});
    if(this.searchQuery != '') {
      this.searchService.searchQuery(this.searchQuery);
    }
  }

  onPlayTrack(uri:string, image: string, name: string, artists: Array<string>) {
    let deviceId = localStorage.getItem('deviceId');
    this.dispPlayer = true;
    this.trackDetail.name = name;
    this.trackDetail.image = image;
    this.trackDetail.artists = artists;
    this.playerService.playTrack(deviceId, uri);
  }

  showForm(uri: string) {
    this.trackUri = uri;
    this.dispForm = true;
  }

  closeForm() {
    this.dispForm = false;
  }

  ngOnDestroy() {
    this.subTracks.unsubscribe();
    this.subPlaylists.unsubscribe();
  }
}
