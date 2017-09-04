import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../../models/challenge';
import {ChallengeService} from "../../../services/challenge.service";
import {Observable} from "rxjs/Observable";
import {InChallengeState} from "../../../enums/in-challenge-state.enum";

@Component({
  selector: 'app-challenge-has-challenged',
  templateUrl: './challenge-has-challenged.component.html',
  styleUrls: ['./challenge-has-challenged.component.css']
})
export class ChallengeHasChallengedComponent implements OnInit {
  InChallengeState = InChallengeState;
  @Input() challenge: Challenge;
  inChallengeState$: Observable<InChallengeState>;

  constructor(private challengeService: ChallengeService) {
    this.inChallengeState$ = this.challengeService.inChallengeState$;
  }

  ngOnInit() {
  }

  selectGame() {
    return this.challengeService.setGame('generated')
  }

  setPlayerAsLoser() {
    return this.challengeService.setPlayerAsLoser();
  }
}
