import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { PlayerService } from '../services/player.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { Player } from '../models/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user$: Observable<User>;
  player$: Observable<Player>;

  constructor(public userService: UserService,
              public playerService: PlayerService) {
    this.user$ = this.userService.user$;
    this.player$ = this.playerService.player$;
  }

  join() {
    return this.playerService.addPlayer();
  }

  leave() {
    return this.playerService.removePlayer();
  }
}
