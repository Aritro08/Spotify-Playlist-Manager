import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistsComponent } from './playlists/playlists.component';
import { SearchComponent } from './search/search.component';
import { AlbumsComponent } from './albums/albums.component';


const routes: Routes = [
  { path: 'playlists', component: PlaylistsComponent },
  { path: 'search', component: SearchComponent, children: [
    { path: '', component: AlbumsComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
