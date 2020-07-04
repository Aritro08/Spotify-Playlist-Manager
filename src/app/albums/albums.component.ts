import { Component, OnInit, OnDestroy } from '@angular/core';
import { Album } from '../models/albums.model';
import { Subscription } from 'rxjs';
import { SearchService } from '../search/search.service';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit, OnDestroy {

  albums1: Album[];
  albums2: Album[];
  subAlbums: Subscription;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.subAlbums = this.searchService.albumsSub.subscribe(albums => {
      this.albums1 = albums.slice(0, 10);
      this.albums2 = albums.slice(10, 10 + albums.length);
    });
  }

  showAlbumTracks(id:string) {
    console.log(id);
  }

  ngOnDestroy() {
    this.subAlbums.unsubscribe();
  }
}
