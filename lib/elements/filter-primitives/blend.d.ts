import { Filter, FilterInput } from "../filter";
import { FilterPrimitive, FilterPrimitive_Attributes } from "../filter-primitive";
export interface Blend_Attributes extends FilterPrimitive_Attributes {
    in: FilterInput;
    in2: FilterInput;
    mode: "normal" | "multiply" | "screen" | "darken" | "lighten";
}
export declare class Blend_Primitive extends FilterPrimitive<SVGFEBlendElement, Blend_Attributes> {
    constructor(filter: Filter, attrs?: Partial<Blend_Attributes>);
}
