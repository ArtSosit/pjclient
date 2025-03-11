import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io(environment.apiBaseUrl);
  }

  emitEvent(event: string, data: any): void {
    this.socket.emit(event, data);
  }

  listenEvent(event: string, callback: Function): void {
    this.socket.on(event, callback);
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }
}
