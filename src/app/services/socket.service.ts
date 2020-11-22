import { Injectable } from '@angular/core';
import { SequenceDeltaEvent, SharedObjectSequence } from '@fluidframework/sequence';
import { Observable, Subject } from 'rxjs';
import { ISocketMessage } from '../models/socket-message';
import { WbContainerRuntimeFactory } from './containerCode';
import { FluidLoaderService } from './fluid-loader.service';
import { WbMsg } from './wbmsg.dataobject';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private messageSubject$: Subject<ISocketMessage> = new Subject<ISocketMessage>();
  public messageReceived$: Observable<ISocketMessage> = this.messageSubject$.asObservable();
  dataObj: SharedObjectSequence<ISocketMessage> | undefined;

  constructor(private fluidService: FluidLoaderService) {
    this.fluidService.loadDataObject<WbMsg>(WbContainerRuntimeFactory).then((val) => {
      this.dataObj = val.dataObj;
      this.dataObj?.on('sequenceDelta', (e: SequenceDeltaEvent) => {
        e.deltaArgs.deltaSegments.forEach((segment) => {
          ((segment.segment as any).items as ISocketMessage[]).forEach((msg) => {
            this.messageSubject$.next(msg);
          });
        });
      });
    });
  }

  sendMessage(message: ISocketMessage): number {
    const insertAt = this.dataObj?.getLength() || 0;
    this.dataObj?.insert(insertAt, [message]);
    return insertAt;
  }

}
