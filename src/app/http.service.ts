import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Message } from './message';

const URL = "/api"

@Injectable({
  providedIn: 'root'
})  
export class HttpService {

  // UserService will store logged in user data
  isLogin: boolean = false;
  loginUserData: User = {} as User; 

  constructor(private http: HttpClient) { }

  // Function for logging in
  login(user: User) {
    return this.http.post(URL + "/login", user);
  }

  // Function for logging out
  logout() {
    return this.http.get(URL + "/logout");
  }

  // Function for registering
  register(user: User) {
    return this.http.post(URL + "/register", user);
  }

  // Setter for loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }  

  getUsers() {
    return this.http.get(URL + "/users");
  }

  getMessages(id: number) {
    return this.http.get(URL + `/messages/${id}`);
  }

  sendMessages(mes: Message) {
    return this.http.post(URL + "/messages", mes);
  }

}
