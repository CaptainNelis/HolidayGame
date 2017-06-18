import { Component, OnInit, } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { Observable } from 'rxjs/Observable';
import { Player } from '../../models/player';
import { ChallengeService } from '../../services/challenge.service';
import { Challenge } from '../../models/challenge';
import { ChallengeState } from '../../enums/challenge-state.enum';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  player$: Observable<Player>;
  opponent$: Observable<Player>;
  players$: Observable<Player[]>;
  challengeState$: Observable<ChallengeState>;

  constructor(private playerService: PlayerService,
              private challengeService: ChallengeService) {
    this.player$ = playerService.player$;
    this.opponent$ = playerService.opponent$;
    this.players$ = playerService.players$;
    this.challengeState$ = challengeService.challengeState$;
  }

  ngOnInit() {
  }

  getCooldownColor(isLocked: boolean): string {
    if (!isLocked) {
      return 'primary';
    } else {
      return 'accent';
    }
  }

  initChallenge(): Promise<any> {
    return this.challengeService.initChallenge();
  }
}
