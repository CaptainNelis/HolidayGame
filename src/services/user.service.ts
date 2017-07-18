import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import 'rxjs/add/observable/of';
import { AFUnwrappedDataSnapshot } from 'angularfire2/interfaces';

@Injectable()
export class UserService {
  readonly user$: Observable<User | null>;

  constructor(private angularFireAuth: AngularFireAuth,
              private angularFireDatabase: AngularFireDatabase,
              private router: Router) {
    this.user$ = this.getUser$();
    this.user$.subscribe(data => console.log('user$', data));
  }

  /**
   * Get currently logged in User.
   * @returns {Observable<User | null>}
   */
  private getUser$(): Observable<User | null> {
    return this.angularFireAuth.authState
      .switchMap((firebaseUser: firebase.User) => {
        if (firebaseUser) {
          return this.angularFireDatabase.object('users/' + firebaseUser.uid)
            .map((user: AFUnwrappedDataSnapshot) => user.$exists() ? user : null);
        } else {
          return Observable.of(null);
        }
      })
      .distinctUntilChanged()
      .shareReplay(1);
  }

  /**
   * Create a new User and login as the new User.
   * @param email
   * @param password
   * @param username
   * @returns {firebase.Promise<any>}
   */
  createUser(email: string, password: string, username: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(firebaseAuthState => {
        this.angularFireDatabase.object('users/' + firebaseAuthState.uid + '/').set({username: username})
          .then(() => {
            this.login(email, password);
          });
      });
  }

  /**
   * Login as User.
   * @param email
   * @param password
   * @returns {firebase.Promise<any>}
   */
  login(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        return this.router.navigateByUrl('/leaderboard');
      });
  }

  /**
   * Log logged in User out.
   * @returns {firebase.Promise<any>}
   */
  logout() {
    return this.angularFireAuth.auth.signOut()
      .then(() => {
        return this.router.navigateByUrl('/login');
      });
  }

  /**
   * Get username.
   * @param uid
   * @returns {Observable<string>}
   */
  getUsername(uid: string): Observable<string> {
    return this.angularFireDatabase.object('users/' + uid + '/username')
      .map(username => username.$value);
  }

  /**
   * Update the username of logged in User.
   * @param username
   * @returns {Promise<any>}
   */
  updateUsername(username: string): Promise<any> {
    return this.angularFireAuth.authState
      .switchMap((user: firebase.User) => {
        return this.angularFireDatabase.object('users/' + user.uid + '/username').set(username);
      })
      .first()
      .toPromise()
  }
}
