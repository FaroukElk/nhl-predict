import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({providedIn: 'root'})
export class UsersService {
  userRetrieved = new Subject<{user: User, predictions: [{}]}>();

  constructor(private http: HttpClient) {}

  getUserRetrievedListener() {
    return this.userRetrieved.asObservable();
  }

  getUser(userId) {
    this.http.get<{
      userData: User,
      message: string,
      predictions: [{}]
    }>('http://localhost:3000/users/' + userId)
      .subscribe((response) => {
        this.userRetrieved.next({user: response.userData, predictions: response.predictions});
      });
  }

}
