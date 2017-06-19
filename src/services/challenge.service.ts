import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { PlayerService } from './player.service';
import { TimeService } from './time.service';
import { Player } from '../models/player';
import { AFUnwrappedDataSnapshot } from 'angularfire2/interfaces';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/distinctUntilChanged';
import { Challenge } from '../models/challenge';
import { ChallengeState } from '../enums/challenge-state.enum';

@Injectable()
export class ChallengeService {
  readonly canChallenge$: Observable<boolean>;
  readonly hasChallenged$: Observable<Challenge>;
  readonly isChallenged$: Observable<Challenge>;
  readonly challengeState$: Observable<ChallengeState>;

  constructor(private angularFireDatabase: AngularFireDatabase,
              private playerService: PlayerService,
              private timeService: TimeService) {
    this.canChallenge$ = this.getCanChallenge$();
    this.hasChallenged$ = this.getHasChallenged$();
    this.isChallenged$ = this.getIsChallenged$();
    this.challengeState$ = this.getChallengeState$();
    this.isChallenged$.subscribe(data => console.log('isChallenged$', data));
    this.canChallenge$.subscribe(data => console.log('canChallenge$', data));
    this.hasChallenged$.subscribe(data => console.log('hasChallenged', data));
    this.challengeState$.subscribe(data => console.log('challengeState', data));
  }

  /**
   * Check if current Player can Challenge.
   * @returns {Observable<boolean>}
   */
  private getCanChallenge$(): Observable<boolean> {
    return this.playerService.player$
      .combineLatest(this.playerService.opponent$)
      .switchMap(([player, opponent]) => {
        if (player && !player.isLocked && opponent && !opponent.isLocked) {
          return this.getChallengeCooldownPercentage$(player.lastPlayed)
            .map((cooldownPercentage: number) => cooldownPercentage === 100)
            .distinctUntilChanged()
        } else {
          return Observable.of(false);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1)
  }

  /**
   * Check if current Player has send a request for Challenge.
   * @returns {Observable<boolean>}
   */
  private getHasChallenged$(): Observable<Challenge> {
    return this.playerService.player$
      .switchMap((player: Player) => {
        if (player) {
          return this.angularFireDatabase.list('challenges', {
            query: {
              orderByChild: 'challenger',
              equalTo: player.$key
            }
          })
            .map((challenges: AFUnwrappedDataSnapshot) => challenges[0] ? challenges[0] : false)
        } else {
          return Observable.of(null);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1)
  }

  /**
   * Check if current Player is challenged.
   * @returns {Observable<boolean>}
   */
  private getIsChallenged$(): Observable<Challenge> {
    return this.playerService.player$
      .switchMap((player: Player) => {
        if (player) {
          return this.angularFireDatabase.list('challenges', {
            query: {
              orderByChild: 'challengee',
              equalTo: player.$key
            }
          })
            .map((challenges: AFUnwrappedDataSnapshot) => challenges[0] ? challenges[0] : false)
        } else {
          return Observable.of(null);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1)
  }

  /**
   * Get challenge state.
   * @returns {Observable<ChallengeState>}
   */
  private getChallengeState$(): Observable<ChallengeState> {
    return this.playerService.player$
      .switchMap((player: Player) => {
        if (player) {
          return this.isChallenged$
            .combineLatest(this.hasChallenged$, this.canChallenge$)
            .switchMap(([isChallenged, hasChallenged, canChallenge]) => {
              if (isChallenged) {
                return Observable.of(ChallengeState.ISCHALLENGED);
              } else if (hasChallenged) {
                return Observable.of(ChallengeState.HASCHALLENGED);
              } else if (canChallenge) {
                return Observable.of(ChallengeState.CANCHALLENGE);
              } else if (player.position === 1) {
                return Observable.of(ChallengeState.FIRSTPLACE);
              } else {
                return Observable.of(ChallengeState.WAITING);
              }
            })
        } else {
          return Observable.of(ChallengeState.NOSTATE);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1)
  }

  /**
   * Get Challenge cooldown percentage.
   * @param lastPlayed
   * @returns {Observable<number>}
   */
  getChallengeCooldownPercentage$(lastPlayed: number): Observable<number> {
    return this.timeService.currentTime$
      .map((currentTime: number) => {
        const percentage = ((((currentTime - lastPlayed) / 1000) / 60) * 100) / 2; // last value is minutes
        if (percentage >= 100) {
          return 100;
        } else {
          return percentage;
        }
      })
      .distinctUntilChanged()
      .shareReplay(1);
  }

  /**
   * Challenge logged in Player's opponent Player.
   * @returns {Promise<any>}
   */
  initChallenge(): Promise<any> {
    return this.playerService.player$
      .combineLatest(this.playerService.opponent$)
      .switchMap(([player, opponent]) => {
        if (player && !player.isLocked && opponent && !opponent.isLocked) {
          return this.angularFireDatabase.list('challenges').push({
            challenger: player.$key,
            challengee: opponent.$key
          })
        }
      })
      .first()
      .toPromise()
  }

  setAccepted(value: boolean): Promise<any> {
    return this.isChallenged$
      .switchMap((challenge: Challenge) => {
        return this.angularFireDatabase.object('challenges/' + challenge.$key).update({
          accepted: value
        });
      })
      .first()
      .toPromise()
  }
}
