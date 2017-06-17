import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage: string;
  email: string;
  password: string;
  username: string;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
  }

  register() {
    this.userService.createUser(this.email, this.password, this.username)
      .catch((error) => {
        this.errorMessage = error.message;
      })
    ;
  }
}
