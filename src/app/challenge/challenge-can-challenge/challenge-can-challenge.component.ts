import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Player } from '../../../models/player';

@Component({
  selector: 'app-challenge-can-challenge',
  templateUrl: './challenge-can-challenge.component.html',
  styleUrls: ['./challenge-can-challenge.component.css']
})
export class ChallengeCanChallengeComponent implements OnInit {
  @Input() opponent: Player;
  @Output() private initChallenge = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  emitInitChallenge() {
    return this.initChallenge.emit();
  }
}
