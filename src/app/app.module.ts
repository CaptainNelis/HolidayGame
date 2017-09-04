import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import 'hammerjs';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ChallengeComponent } from './challenge/challenge.component';
import { LoginComponent } from './login/login.component';
import { PlayerService } from '../services/player.service';
import { UserService } from '../services/user.service';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MATERIAL_MODULES } from '../modules/material.module';
import { environment } from '../environments/environment';
import { UsernamePipe } from '../pipes/username.pipe';
import { ChallengeService } from '../services/challenge.service';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2/angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { TimeService } from '../services/time.service';
import { CooldownPercentagePipe } from '../pipes/cooldown-percentage.pipe';
import { ChallengeNostateComponent } from './challenge/challenge-nostate/challenge-nostate.component';
import { ChallengeIsChallengedComponent } from './challenge/challenge-is-challenged/challenge-is-challenged.component';
import { ChallengeHasChallengedComponent } from './challenge/challenge-has-challenged/challenge-has-challenged.component';
import { ChallengeCanChallengeComponent } from './challenge/challenge-can-challenge/challenge-can-challenge.component';
import { ChallengeWaitingComponent } from './challenge/challenge-waiting/challenge-waiting.component';
import { ChallengeFirstPlaceComponent } from './challenge/challenge-first-place/challenge-first-place.component';

const appRoutes: Routes = [
  {path: '', redirectTo: '/leaderboard', pathMatch: 'full'},
  {path: 'challenge', component: ChallengeComponent},
  {path: 'leaderboard', component: LeaderboardComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ChallengeComponent,
    LeaderboardComponent,
    LoginComponent,
    RegisterComponent,
    UsernamePipe,
    CooldownPercentagePipe,
    ChallengeNostateComponent,
    ChallengeIsChallengedComponent,
    ChallengeHasChallengedComponent,
    ChallengeCanChallengeComponent,
    ChallengeWaitingComponent,
    ChallengeFirstPlaceComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseCredentials),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule,
    MATERIAL_MODULES,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [
    PlayerService,
    UserService,
    ChallengeService,
    TimeService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
