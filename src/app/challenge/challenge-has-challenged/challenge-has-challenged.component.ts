import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../../models/challenge';

@Component({
  selector: 'app-challenge-has-challenged',
  templateUrl: './challenge-has-challenged.component.html',
  styleUrls: ['./challenge-has-challenged.component.css']
})
export class ChallengeHasChallengedComponent implements OnInit {
  @Input() challenge: Challenge;

  constructor() { }

  ngOnInit() {
  }

}
