import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import 'rxjs/add/operator/toPromise';
import { Player } from '../models/player';
import { User } from '../models/user';
import { AFUnwrappedDataSnapshot } from 'angularfire2/interfaces';

@Injectable()
export class PlayerService {
  readonly player$: Observable<Player>;
  readonly players$: Observable<Player[]>;
  readonly opponent$: Observable<Player>;

  constructor(private userService: UserService,
              private angularFireDatabase: AngularFireDatabase) {
    this.player$ = this.getPlayer$();
    this.players$ = this.getPlayers$();
    this.opponent$ = this.getOpponent$();
    this.player$.subscribe(data => console.log('player$', data));
    this.opponent$.subscribe(data => console.log('opponent$', data));
  }

  /**
   * Get currently logged in Player.
   * @returns {Observable<Player | null>}
   */
  private getPlayer$(): Observable<Player | null> {
    return this.userService.user$
      .switchMap((user: User) => {
        if (user) {
          return this.angularFireDatabase.object('players/' + user.$key)
            .map(player => player.position ? player : null);
        } else {
          return Observable.of(null);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1);
  }

  /**
   * Get all players ordered by position.
   * @returns {Observable<Player[]>}
   */
  private getPlayers$(): Observable<Player[]> {
    return this.angularFireDatabase.list('players', {
      query: {
        orderByChild: 'position',
        startAt: 0
      }
    })
      .shareReplay(1)
  }

  /**
   * Get the Player that has a position that is one lower than logged in Player.
   * @returns {Observable<Player | null>}
   */
  private getOpponent$(): Observable<Player | null> {
    return this.player$
      .switchMap((player: Player) => {
        if (player) {
          return this.angularFireDatabase.list('players', {
            query: {
              orderByChild: 'position',
              limitToLast: 1,
              endAt: player.position - 1
            }
          })
            .map((players: AFUnwrappedDataSnapshot[]) => players[0] ? players[0] : null)
        } else {
          return Observable.of(null);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1)
  }

  /**
   * Add new Player to game.
   * @returns {Promise<any>}
   */
  addPlayer(): Promise<any> {
    return this.userService.user$
      .switchMap((user: User) => {
        return this.angularFireDatabase.object('players/' + user.$key).set({
          isLocked: false,
          lastPlayed: firebase.database.ServerValue.TIMESTAMP
        });
      })
      .first()
      .toPromise();
  }

  /**
   * Remove a player.
   * @returns {Promise<any>}
   */
  removePlayer(): Promise<any> {
    return this.userService.user$
      .switchMap((user: User) => {
        return this.angularFireDatabase.object('players/' + user.$key).remove();
      })
      .first()
      .toPromise();
  }
}
