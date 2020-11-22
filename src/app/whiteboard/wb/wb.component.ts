import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICoordinates } from 'src/app/models/coordinates';
import { ISvgElement, SvgElementTypes } from 'src/app/models/svg-element-types';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-wb',
  templateUrl: './wb.component.svg',
  styleUrls: ['./wb.component.scss']
})
export class WbComponent implements OnInit, OnDestroy {

  /**
   * Dimensions of the container, inherited by the SVG element.
   */
  private dimensions: DOMRect = new DOMRect();
  /**
   * Flag if the user is writing
   */
  private isPathInMotion = false;
  /**
   * Current element index for which the properties to update
   */
  private currentElementIndex = -1;
  private sockSub: Subscription = new Subscription();

  svgViewBox = '';
  svgElements: ISvgElement[] = [];
  SvgElementTypesEnum = SvgElementTypes;

  constructor(
    private element: ElementRef<HTMLElement>,
    private webSocketService: SocketService,
    private cdr: ChangeDetectorRef
  ) { }

  private isSvgElement(msg: object): msg is ISvgElement {
    return (msg as ISvgElement).elementType !== undefined;
  }

  ngOnInit(): void {
    this.dimensions = this.element.nativeElement.getBoundingClientRect();
    this.svgViewBox = '0 0 ' + this.dimensions.width + ' ' + this.dimensions.height;
    this.sockSub = this.webSocketService.messageReceived$.subscribe((msg) => {
      const payload = msg.payload;
      if (this.isSvgElement(payload)) {
        this.svgElements.push(payload);
      } else {
        if (payload.eventType === 'addPoint') {
          this.svgElements[payload.ndx].elementAttributes.d += ' L' + payload.xy.x + ' ' + payload.xy.y;
        }
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.sockSub?.unsubscribe();
  }

  public trackByFn(index: number): number {
    return index;
  }

  public isTouchEvent(event: any): boolean {
    if ((window as any).TouchEvent !== undefined) {
      return event instanceof TouchEvent;
    }
    return event.touches !== undefined;
  }

  private getUniversalSvgE(e: MouseEvent | TouchEvent | any): ICoordinates {
    const svgEvent: ICoordinates = {x: 0, y: 0};
    if (this.isTouchEvent(e)) {
      svgEvent.x = e.changedTouches[0].pageX - this.dimensions.left;
      svgEvent.y = e.changedTouches[0].pageY - this.dimensions.top;
    } else {
      svgEvent.x = e.offsetX;
      svgEvent.y = e.offsetY;
    }
    svgEvent.x = Number(svgEvent.x.toFixed(3));
    svgEvent.y = Number(svgEvent.y.toFixed(3));
    return svgEvent;
  }

  public matrixArr(nums: number[]): string {
    return 'matrix(' + nums.join(' ') + ')';
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  public start(e: MouseEvent | TouchEvent | any): void {
    e.preventDefault();
    e.stopPropagation();
    this.isPathInMotion = true;
    const xy: ICoordinates = this.getUniversalSvgE(e);
    this.currentElementIndex = this.svgElements.length;
    const svgElement: ISvgElement = {
      elementType: SvgElementTypes.POLYLINE,
      elementAttributes: {
        strokeWidth: 1.2,
        strokeShadowblur: 1.2,
        stroke: '#000000',
        d: 'M' + xy.x + ' ' + xy.y,
        transform: [1, 0, 0, 1, 0, 0]
      }
    };
    this.webSocketService.sendMessage({ payload: svgElement });
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  public inprogress(e: MouseEvent | TouchEvent | any): void {
    if (this.isPathInMotion) {
      e.preventDefault();
      e.stopPropagation();
      const xy: ICoordinates = this.getUniversalSvgE(e);
      this.webSocketService.sendMessage({ payload: { ndx: this.currentElementIndex, eventType: 'addPoint', xy } });
    }
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('touchcancel', ['$event'])
  @HostListener('mouseleave', ['$event'])
  public stop(e: MouseEvent | TouchEvent | any): void {
    if (this.isPathInMotion) {
      e.preventDefault();
      e.stopPropagation();
      this.isPathInMotion = false;
    }
  }

}
