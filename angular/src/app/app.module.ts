import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatDialogModule, MatSortModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { GameListComponent } from './game-list/game-list.component';
import { HttpClientModule } from '@angular/common/http';
import { SelectedDirective } from './selected.directive';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';
import { MyDialogComponent } from './my-dialog/my-dialog.component';
import { RatioPercentPipe } from './ratio-percent.pipe';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HeaderComponent,
    GameListComponent,
    SelectedDirective,
    ProfileComponent,
    MyDialogComponent,
    RatioPercentPipe,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [
    MyDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
