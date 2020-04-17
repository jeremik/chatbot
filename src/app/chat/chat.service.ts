import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript/es6/ApiAiClient';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public test: boolean;

  readonly token = environment.dialogFlow.nyxBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);
  typing = new BehaviorSubject<boolean>(false);
  constructor() { }

  public update(msg: any) {
    this.conversation.next(msg);
  }

  public converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg).then(async (res) => {
      this.typing.next(true);
      await this.delay(900);
      const speech = await res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
      this.typing.next(false);
    });

  }

  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  public setGreetings() {
    const msg = 'Oh, Hi! there';
    const botMessage = new Message(msg, 'bot');
    this.update(botMessage);
  }

  public talk() {
    this.client.textRequest('Who are you!').then(res => console.log(res));
  }
}
