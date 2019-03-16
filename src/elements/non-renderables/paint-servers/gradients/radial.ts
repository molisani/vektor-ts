import { Length } from "../../../../attributes/base";
import { Point } from "../../../../attributes/point";
import { XMLNS } from "../../../../constants";
import { Context } from "../../../../context";
import { AbstractGradient, Gradient_Attributes, Stops } from "../gradient";

export interface RadialGradient_Attributes extends Gradient_Attributes {
  cx: Length;
  cy: Length;
  "cx:cy": Point;
  r: Length;
  fx: Length;
  fy: Length;
  "fx:fy": Point;
}

export class RadialGradient extends AbstractGradient<SVGRadialGradientElement, RadialGradient_Attributes> {
  constructor(context: Context, stops: Stops, attrs?: Partial<RadialGradient_Attributes>) {
    super(context, context.window.document.createElementNS(XMLNS, "radialGradient"), stops, attrs);
  }
}
