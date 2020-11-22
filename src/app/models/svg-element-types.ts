export enum SvgElementTypes {
    POLYLINE
}
export interface IPathAttributes {
    strokeWidth: number;
    strokeShadowblur: number;
    stroke: string;
    d: string;
    transform: number[];
}
export interface ISvgElement {
    elementType: SvgElementTypes;
    elementAttributes: IPathAttributes;
}
export interface ISvgPolyLinePath {
    ndx: number;
    eventType: string;
    xy: {x: number, y: number};
}
