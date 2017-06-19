import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Challenge } from '../../../models/challenge';

@Component({
  selector: 'app-challenge-is-challenged',
  templateUrl: './challenge-is-challenged.component.html',
  styleUrls: ['./challenge-is-challenged.component.css']
})
export class ChallengeIsChallengedComponent implements OnInit {
  @Input() challenge: Challenge;
  @Output() private challengeAccepted = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitChallengeAccepted(value: boolean) {
    this.challengeAccepted.emit(value);
  }
}
