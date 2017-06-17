import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: string;
  email: string;
  password: string;

  constructor(public userService: UserService,
              private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.email, this.password)
      .catch((error) => {
        this.errorMessage = error.message;
      });
  }
}
