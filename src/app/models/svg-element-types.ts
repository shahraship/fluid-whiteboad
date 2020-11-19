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
