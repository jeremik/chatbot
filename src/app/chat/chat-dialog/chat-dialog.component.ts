import { Observable } from 'rxjs';
import { ChatService, Message } from './../chat.service';
import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, } from '@angular/core';
import { scan, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.scss']
})
export class ChatDialogComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;
  messages: Observable<Message[]>;
  typing: any;
  formValue = '';

  constructor(private chat: ChatService) { }

  ngOnInit() {
    // this.chat.talk();
    console.log('this.formValue1', this.formValue);
    this.messages = this.chat.conversation.asObservable().pipe(scan((acc, val) => acc.concat(val)));
    this.chat.typing.asObservable().pipe(distinctUntilChanged()).subscribe(res => {
      this.typing = res;
    });
  }

  public sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

}
