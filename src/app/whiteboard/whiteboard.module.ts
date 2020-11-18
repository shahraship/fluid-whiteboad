import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhiteboardRoutingModule } from './whiteboard-routing.module';
import { IndexComponent } from './index/index.component';
import { WbComponent } from './wb/wb.component';


@NgModule({
  declarations: [IndexComponent, WbComponent],
  imports: [
    CommonModule,
    WhiteboardRoutingModule
  ]
})
export class WhiteboardModule { }
