import { Component, OnInit } from '@angular/core';
import {Settings} from '../../services/settings.service';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
public currentYear: any;
  constructor(public settings: Settings) { }

  ngOnInit() {
    const date = new Date();
    this.currentYear = date.getFullYear();
  }

}
