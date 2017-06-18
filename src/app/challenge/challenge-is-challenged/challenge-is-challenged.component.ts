import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../../models/challenge';

@Component({
  selector: 'app-challenge-is-challenged',
  templateUrl: './challenge-is-challenged.component.html',
  styleUrls: ['./challenge-is-challenged.component.css']
})
export class ChallengeIsChallengedComponent implements OnInit {
  @Input() challenge: Challenge;

  constructor() { }

  ngOnInit() {
  }

}
