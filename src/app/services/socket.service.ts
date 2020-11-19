import { Injectable } from '@angular/core';
import { ISocketMessage } from '../models/socket-message';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  sendMessage(message: ISocketMessage): void {

  }

}
