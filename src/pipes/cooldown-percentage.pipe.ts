import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChallengeService } from '../services/challenge.service';


@Pipe({
  name: 'cooldownPercentage'
})
export class CooldownPercentagePipe implements PipeTransform {
  constructor(private challengeService: ChallengeService) {
  }

  transform(value: number): Observable<number> {
    return this.challengeService.getChallengeCooldownPercentage$(value);
  }
}
