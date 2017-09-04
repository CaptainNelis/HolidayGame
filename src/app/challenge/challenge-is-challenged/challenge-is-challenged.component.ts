import { Component, Input, OnInit } from '@angular/core';
import { Challenge } from '../../../models/challenge';
import {ChallengeService} from "../../../services/challenge.service";
import {Observable} from "rxjs/Observable";
import {InChallengeState} from "../../../enums/in-challenge-state.enum";

@Component({
  selector: 'app-challenge-is-challenged',
  templateUrl: './challenge-is-challenged.component.html',
  styleUrls: ['./challenge-is-challenged.component.css']
})
export class ChallengeIsChallengedComponent implements OnInit {
  InChallengeState = InChallengeState;
  @Input() challenge: Challenge;
  inChallengeState$: Observable<InChallengeState>;

  constructor(private challengeService: ChallengeService) {
    this.inChallengeState$ = this.challengeService.inChallengeState$;
  }

  ngOnInit() {
  }

  setChallengeAccepted(value: boolean): Promise<any> {
    return this.challengeService.setAccepted(value);
  }

  setPlayerAsLoser() {
    return this.challengeService.setPlayerAsLoser();
  }
}
