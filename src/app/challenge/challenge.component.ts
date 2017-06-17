import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ChallengeService } from '../../services/challenge.service';
import { Challenge } from '../../models/challenge';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit {
  isChallenged$: Observable<Challenge>;

  constructor(private challengeService: ChallengeService) {
    this.isChallenged$ = challengeService.isChallenged$;
  }

  ngOnInit() {
  }

}
