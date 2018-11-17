import {Component, Input, OnInit} from '@angular/core';
import {Settings} from '../../services/settings.service';
declare const $;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
@Input() activeNav: string;
  constructor(public settings: Settings) { }

  ngOnInit() {
    console.log('Trigger Component');
  }

}
