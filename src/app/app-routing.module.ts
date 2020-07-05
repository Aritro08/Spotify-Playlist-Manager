import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistsComponent } from './playlists/playlists.component';
import { SearchComponent } from './search/search.component';
import { AlbumsComponent } from './albums/albums.component';
import { AlbumTracksComponent } from './albums/album-tracks/album-tracks.component';


const routes: Routes = [
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'search', component: SearchComponent, children: [
    { path: '', component: AlbumsComponent },
    { path: 'album', component: AlbumTracksComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
