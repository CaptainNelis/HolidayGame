import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import 'rxjs/add/operator/take';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit {
  usernameResult: string;
  username: string;

  constructor(public userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
    this.userService.user$
      .take(1)
      .subscribe((user: User) => this.username = user.username);
  }

  updateUsername() {
    this.userService.updateUsername(this.username)
      .then(() => {
        return this.router.navigateByUrl('/leaderboard');
      })
      .catch((error) => {
        this.usernameResult = error.message;
      })
    ;
  }
}
