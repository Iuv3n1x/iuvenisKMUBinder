import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Streak } from '../streak/streak';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, Streak],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
