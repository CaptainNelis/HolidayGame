import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'username'
})
export class UsernamePipe implements PipeTransform {
  constructor(private userService: UserService) {
  }

  transform(value: string): Observable<string> {
    return this.userService.getUsername(value);
  }
}
