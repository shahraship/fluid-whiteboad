import { ISvgElement, ISvgPolyLinePath } from './svg-element-types';

export interface ISocketMessage {
    payload: ISvgElement | ISvgPolyLinePath;
}
