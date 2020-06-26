import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { PlaylistService } from '../playlists/playlist.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  token: string;
  userName = 'xyz';
  navSub: Subscription;
  navElem = 0;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
    this.navSub = this.playlistService.navElements.subscribe(n => {
      this.navElem = n;
    });
  }

}
