import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-panel',
  templateUrl: './player-panel.component.html',
  styleUrls: ['./player-panel.component.css']
})
export class PlayerPanelComponent implements OnInit {

  constructor() { }

  open = false;
  @Input() trackDetail: {name: string, image: string, artists: Array<string>};

  ngOnInit(): void {
  }

  toggle() {
    this.open = !this.open;
  }
}
