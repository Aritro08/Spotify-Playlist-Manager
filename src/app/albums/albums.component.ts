import { Component, OnInit, OnDestroy } from '@angular/core';
import { Album } from '../models/albums.model';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SearchService } from '../search/search.service';
import { AlbumService } from './album.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit, OnDestroy {

  albums1: Album[];
  albums2: Album[];
  searchQuery: string;
  subAlbums: Subscription;
  subQuery: Subscription;

  constructor(private searchService: SearchService, private albumService: AlbumService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.subAlbums = this.searchService.albumsSub.subscribe(albums => {
      this.albums1 = albums.slice(0, 10);
      this.albums2 = albums.slice(10, 10 + albums.length);
    });
    this.subQuery = this.searchService.querySub.subscribe(query => {
      this.searchQuery = query;
    });
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if(event.url == '/search') {
        this.searchService.searchQuery(this.searchQuery);
      }
    });
  }

  getTracks(id: string, name: string, artists: Array<string>, image: string, date: string) {
    this.albumService.getAlbumTracks(id, name, artists, image, date);
    this.router.navigate(['album'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.subAlbums.unsubscribe();
  }
}
