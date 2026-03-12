import { Component } from '@angular/core';

@Component({
  selector: 'app-streak',
  imports: [],
  templateUrl: './streak.html',
  styleUrl: './streak.scss',
})
export class Streak {
  streakCounter = 0;
  daysLeft = 0;
}
