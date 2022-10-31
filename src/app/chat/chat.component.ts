import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  constructor(
    private router: Router,
    private httpService: HttpService,
  ) {
    if (!httpService.isLogin) {
      this.router.navigate(['/login']);
    }
  }

}
