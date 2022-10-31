import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { User } from '../user';
import { DataApiResponse } from '../api-response';
import { Message } from '../message';
import { MessageWSService } from '../message-ws.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  users: User[] = [];
  messagesToUser: Message[] = [];
  selectedUser: User = {} as User;
  userSubscription: any;
  messageSubscription: any;

  constructor(
    private router: Router,
    private httpService: HttpService,
    private messageWsService: MessageWSService
  ) {
    if (!httpService.isLogin) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {
    this.onAnotherUserConnected();
    this.onMessage();
  }

  onAnotherUserConnected() {
    this.userSubscription = this.messageWsService.onAnotherUserConneted.subscribe(bool => {
      this.reloadUsers();
    })
  }

  onMessage() {
    this.messageSubscription = this.messageWsService.onMessage.subscribe(msg => {
      this.getMessagesWithSelectedUser();
    })
  }

  getMyId() {
    return this.httpService.loginUserData.user_id;
  }

  sendMessage(mes: string) {
    this.httpService.sendMessages(new Message(0, this.getMyId(), this.selectedUser.user_id, mes)).subscribe({
      next: (data) => {
        console.log("ChatComponent, onSubmit:", data);
      },
      error: (error) => {
      }
    });
  }

  // Function reloading users
  reloadUsers() {
    this.httpService.getUsers().subscribe({
      next: (data) => {
        if (data.hasOwnProperty("data")) {
          let responseData = data as DataApiResponse<User>;
          if (Array.isArray(responseData.data)) {
            this.users = responseData.data;
          }
        }
      },
      error: (error) => {
      }
    });
  }

  // function called, when a user will be selected
  userSelected(user: User) {
    this.selectedUser = user;
    console.log("Selected user", this.selectedUser)
    this.getMessagesWithSelectedUser();
  }

  // function getting list of messages with a given user
  getMessagesWithSelectedUser() {
    this.httpService.getMessages(this.selectedUser.user_id).subscribe({
      next: (data) => {
        if (data.hasOwnProperty("data")) {
          let responseData = data as DataApiResponse<Message>;
          if (Array.isArray(responseData.data)) {
            this.messagesToUser = responseData.data;
          }
        }
      },
      error: (error) => {
      }
    });
  }

}
