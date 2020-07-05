import { Component, OnInit, OnDestroy } from '@angular/core';
import { SearchService } from './search.service'
import { Track } from '../models/track.model';
import { Subscription } from 'rxjs';
import { Playlists } from '../models/playlists.model';
import { PlaylistService } from '../playlists/playlist.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  searchQuery: string;
  trackUri: string;
  playlists: Playlists[];
  tracks: Track[];
  subTracks: Subscription;
  subPlaylists: Subscription;
  dispForm = false;

  constructor(private searchService: SearchService, private playlistService: PlaylistService, private route: ActivatedRoute, private router: Router) { }

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
