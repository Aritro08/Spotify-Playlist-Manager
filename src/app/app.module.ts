import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { TracksComponent } from './playlists/tracks/tracks.component';
import { SearchComponent } from './search/search.component';
import { AlbumsComponent } from './albums/albums.component';
import { DropdownDirective } from './dropdown.directive';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { AlbumTracksComponent } from './albums/album-tracks/album-tracks.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlaylistsComponent,
    TracksComponent,
    SearchComponent,
    AlbumsComponent,
    DropdownDirective,
    CreatePlaylistComponent,
    AlbumTracksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
