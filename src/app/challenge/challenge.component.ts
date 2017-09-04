import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChallengeService } from '../../services/challenge.service';
import { Challenge } from '../../models/challenge';
import { ChallengeState } from '../../enums/challenge-state.enum';
import { Player } from '../../models/player';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {
  ChallengeState = ChallengeState;
  challengeState$: Observable<ChallengeState>;
  isChallenged$: Observable<Challenge>;
  hasChallenged$: Observable<Challenge>;
  opponent$: Observable<Player>;

  constructor(private challengeService: ChallengeService,
              private playerService: PlayerService) {
    this.challengeState$ = challengeService.challengeState$;
    this.isChallenged$ = challengeService.isChallenged$;
    this.hasChallenged$ = challengeService.hasChallenged$;
    this.opponent$ = playerService.opponent$;
  }

  ngOnInit() {
  }

  initChallenge(): Promise<any> {
    return this.challengeService.initChallenge();
  }
}
