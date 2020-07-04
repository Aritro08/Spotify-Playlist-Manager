import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PlaylistService } from '../playlists/playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  name: string;
  @Input() trackUri: string;
  @Output() closeForm = new EventEmitter<void>();

  constructor(private playlistService: PlaylistService) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    this.playlistService.createPlaylist(form.value.name, this.trackUri);
    form.reset();
    this.closeForm.emit();
  }

  onClose(){
    this.closeForm.emit();
  }

}
