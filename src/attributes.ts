import { ColorString, isColorString } from "./colors";
import { ColorStyleProperties } from "./style";
import { isTransform, matrix, rotate, scale, skewX, skewY, Transform, translate } from "./transforms";
import { Mutable, Replace, Select } from "./ts-util";
import { angle, Angle, AngleUnit, isAngleUnit, isLengthUnit, Length, length, LengthUnit, point, Point } from "./types";

type SerializeHint = "svg" | "css";

const AngleTypeMap: { [lengthType: number]: AngleUnit } = {
  [SVGAngle.SVG_ANGLETYPE_DEG]: "deg",
  [SVGAngle.SVG_ANGLETYPE_RAD]: "rad",
  [SVGAngle.SVG_ANGLETYPE_GRAD]: "grad",
};

function fromSVGAngle(svg: SVGAngle): Angle {
  const value = svg.value;
  const unitType = svg.unitType;
  if (unitType === SVGAngle.SVG_ANGLETYPE_UNKNOWN || unitType === SVGAngle.SVG_ANGLETYPE_UNSPECIFIED) {
    return value;
  }
  return angle(value, AngleTypeMap[svg.unitType]);
}

const LengthTypeMap: { [lengthType: number]: LengthUnit } = {
  [SVGLength.SVG_LENGTHTYPE_PERCENTAGE]: "%",
  [SVGLength.SVG_LENGTHTYPE_EMS]: "em",
  [SVGLength.SVG_LENGTHTYPE_EXS]: "ex",
  [SVGLength.SVG_LENGTHTYPE_PX]: "px",
  [SVGLength.SVG_LENGTHTYPE_CM]: "cm",
  [SVGLength.SVG_LENGTHTYPE_MM]: "mm",
  [SVGLength.SVG_LENGTHTYPE_IN]: "in",
  [SVGLength.SVG_LENGTHTYPE_PT]: "pt",
  [SVGLength.SVG_LENGTHTYPE_PC]: "pc",
};

function fromSVGLength(svg: SVGLength): Length {
  const value = svg.value;
  const unitType = svg.unitType;
  if (unitType === SVGLength.SVG_LENGTHTYPE_UNKNOWN || unitType === SVGLength.SVG_LENGTHTYPE_NUMBER) {
    return value;
  }
  return length(value, LengthTypeMap[svg.unitType]);
}

function fromDOMPoint(dom: DOMPoint): Point {
  return point(dom.x, dom.y);
}

interface SVGListOf<T> {
  readonly numberOfItems: number;
  getItem(index: number): T;
}

function fromSVGTransform(svg: SVGTransform): Transform {
  const { a, b, c, d, e, f } = svg.matrix;
  switch (svg.type) {
    case SVGTransform.SVG_TRANSFORM_MATRIX:
      return matrix([a, b, c, d, e, f]);
    case SVGTransform.SVG_TRANSFORM_TRANSLATE:
      return translate(e, f);
    case SVGTransform.SVG_TRANSFORM_SCALE:
      return scale(a, d);
    case SVGTransform.SVG_TRANSFORM_ROTATE: {
      const radians = (svg.angle / 180) * Math.PI;
      let cx: number;
      let cy: number;
      if (svg.angle % 180 === 0) {
        cx = 0.5 * e;
        cy = 0.5 * f;
      } else {
        const halfCot = 1 / Math.tan(radians / 2);
        cx = 0.5 * (e - f * halfCot);
        cy = 0.5 * (e * halfCot + f);
      }
      return rotate(svg.angle, cx, cy);
    }
    case SVGTransform.SVG_TRANSFORM_SKEWX:
      return skewX(svg.angle);
    case SVGTransform.SVG_TRANSFORM_SKEWY:
      return skewY(svg.angle);
  }
  throw new Error(`Unknown SVGTransform type=${svg.type}`);
}

function* iterateList<T>(svg: SVGListOf<T>): Generator<T> {
  for (let i = 0; i < svg.numberOfItems; ++i) {
    yield svg.getItem(i);
  }
}

function fromSVGTransformList(svg: SVGTransformList): readonly Transform[] {
  return Array.from(iterateList(svg)).map(fromSVGTransform);
}

export type TypedAttributeValue =
  | ["boolean", boolean]
  | ["number", number]
  | ["string", string]
  | ["angle", Angle]
  | ["length", Length]
  | ["funciri", HTMLElement]
  | ["color-string", ColorString]
  | ["length-array", readonly Length[]]
  | ["number-array", readonly number[]]
  | ["point-array", readonly Point[]]
  | ["transform-array", readonly Transform[]]

function isAttributeColorString(key: string, cssValue: string): cssValue is ColorString {
  return isColorString(cssValue) || ColorStyleProperties.has(key);
}

export function parseAttribute(key: string, cssValue: string): TypedAttributeValue {
  if (key === "stroke-dasharray") {
    return ["length-array", cssValue.split(/\s+,?\s*|,\s*/).map((dash) => {
      const dashValue = parseFloat(dash);
      if (isNaN(dashValue)) {
        return 0;
      }
      const numberAsString = dashValue.toString();
      const suffix = dash.slice(0, numberAsString.length);
      if (isLengthUnit(suffix)) {
        return length(dashValue, suffix);
      }
      return dashValue;
    })];
  }
  try {
    const cssNumberValue = parseFloat(cssValue);
    if (!isNaN(cssNumberValue)) {
      const numberAsString = cssNumberValue.toString();
      const suffix = cssValue.slice(0, numberAsString.length);
      if (isLengthUnit(suffix)) {
        return ["length", length(cssNumberValue, suffix)];
      }
      if (isAngleUnit(suffix)) {
        return ["angle", angle(cssNumberValue, suffix)];
      }
      return ["number", cssNumberValue];
    }
  } catch {
    // no-op
  }
  try {
    if (cssValue.startsWith("url(")) {
      const id = cssValue.slice(5, -1);
      const funciriElement = document.getElementById(id);
      if (funciriElement) {
        return ["funciri", funciriElement];
      }
    }
  } catch {
    // no-op
  }
  if (isAttributeColorString(key, cssValue)) {
    return ["color-string", cssValue];
  }
  return ["string", cssValue];
}

export function getAttribute<ELEMENT extends SVGElement>(el: ELEMENT, key: keyof ELEMENT): TypedAttributeValue {
  const current = el[key];
  if (current instanceof SVGAnimatedBoolean) {
    return ["boolean", current.baseVal];
  }
  if (current instanceof SVGAnimatedInteger || current instanceof SVGAnimatedNumber) {
    return ["number", current.baseVal];
  }
  if (current instanceof SVGAnimatedString) {
    return ["string", current.baseVal];
  }
  if (current instanceof SVGAnimatedAngle) {
    return ["angle", fromSVGAngle(current.baseVal)];
  }
  if (current instanceof SVGAnimatedLength) {
    return ["length", fromSVGLength(current.baseVal)];
  }
  if (current instanceof SVGAnimatedLengthList) {
    return ["length-array", Array.from(current.baseVal).map(fromSVGLength)];
  }
  if (current instanceof SVGAnimatedNumberList) {
    return ["number-array", Array.from(current.baseVal).map((svg) => svg.value)];
  }
  if (current instanceof SVGPointList) {
    return ["point-array", Array.from(current).map(fromDOMPoint)];
  }
  if (current instanceof SVGAnimatedTransformList) {
    return ["transform-array", fromSVGTransformList(current.baseVal)];
  }
  const strValue = el.getAttribute(key);
  if (strValue !== null) {
    return parseAttribute(key, strValue);
  }
  throw new Error(`Querying attribute "${key}" is not currently supported through this API`);
}

export function serializeAttribute(value: any, hint: SerializeHint = "svg"): string {
  if (value instanceof SVGElement) {
    return `url(#${value.id})`;
  }
  if (Array.isArray(value)) {
    return value.map((val: any) => {
      if (hint === "css" && isTransform(val)) {
        return val.toCSS();
      }
      return String(val);
    }).join(" ");
  }
  return String(value);
}

export function setAttribute(el: SVGElement, key: object): void;
export function setAttribute(el: SVGElement, key: string, value: any): void;
export function setAttribute(el: SVGElement, key: object | string, value?: any): void {
  if (typeof key === "object") {
    for (const [innerKey, innerValue] of Object.entries(key)) {
      setAttribute(el, innerKey, innerValue);
    }
    return;
  }
  el.setAttribute(key, serializeAttribute(value));
}

type ReplaceAttributes<ELEMENT extends SVGElement, T, R> = Mutable<Replace<Omit<Select<ELEMENT, T>, "className" | "animatedPoints">, R>>;

export type SavageDOMAttributes<ELEMENT extends SVGElement = SVGElement> =
  & ReplaceAttributes<ELEMENT, SVGAnimatedAngle, Angle>
  & ReplaceAttributes<ELEMENT, SVGAnimatedBoolean, boolean>
  & ReplaceAttributes<ELEMENT, SVGAnimatedInteger, number>
  & ReplaceAttributes<ELEMENT, SVGAnimatedLength, Length>
  & ReplaceAttributes<ELEMENT, SVGAnimatedLengthList, readonly Length[]>
  & ReplaceAttributes<ELEMENT, SVGAnimatedNumber, number>
  & ReplaceAttributes<ELEMENT, SVGAnimatedNumberList, readonly number[]>
  & ReplaceAttributes<ELEMENT, SVGPointList, readonly Point[]>
  & ReplaceAttributes<ELEMENT, SVGAnimatedString, string>
  & ReplaceAttributes<ELEMENT, SVGAnimatedTransformList, readonly Transform[]>;