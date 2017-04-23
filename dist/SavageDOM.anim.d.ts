declare namespace SavageDOM {
    const XMLNS = "http://www.w3.org/2000/svg";
    const XLINK = "http://www.w3.org/1999/xlink";
}
declare namespace SavageDOM {
    interface Setter {
        set<Attrs>(element: Element<SVGElement, Attrs, any>, attr: keyof Attrs, override?: any): void;
    }
    interface Attribute<T> extends Setter {
        toString(override?: T): string;
        parse(css: string | null): T;
        get<Attrs>(element: Element<SVGElement, Attrs, any>, attr: keyof Attrs): T;
        set<Attrs>(element: Element<SVGElement, Attrs, any>, attr: keyof Attrs, override?: T): void;
        interpolate(from: T, t: number): T;
    }
    function _defaultGet<T>(this: Attribute<T>, element: Element<SVGElement, any, any>, attr: string): T;
    function _defaultSet<T>(this: T, element: Element<SVGElement, any, any>, attr: string, override?: T): void;
}
declare namespace SavageDOM.Attribute {
    const isAttribute: (obj: any) => obj is Attribute<any>;
    type Inherit = "inherit";
    type None = "none";
    namespace NonRenderable {
        interface PaintServer {
        }
    }
    type CurrentColor = "currentColor";
    type Paint = None | CurrentColor | Color | NonRenderable.PaintServer | Inherit;
    type Length = number | Dimension<CSSAbsoluteLength | CSSRelativeLength | "%">;
    type Angle = number | Dimension<CSSAngleUnit>;
    const _LengthParse: (css: string) => Length;
    const _LengthInterpolate: (a: Length, b: Length, t: number) => Length;
    interface HasStyle {
        style: string;
    }
    interface HasClass {
        class: string;
    }
    interface HasOverflow {
        overflow: "visible" | "hidden" | "scroll" | "auto" | Inherit;
    }
    interface HasColor {
        color: Color | Inherit;
    }
    interface HasColorInterpolation {
        "color-interpolation": "auto" | "sRGB" | "linearRGB" | Inherit;
    }
    interface HasColorRendering {
        "color-rendering": "auto" | "optimizeSpeed" | "optimizeQuality" | Inherit;
    }
    interface HasCursor {
        cursor: "auto" | "crosshair" | "default" | "pointer" | "move" | "e-resize" | "ne-resize" | "nw-resize" | "n-resize" | "se-resize" | "sw-resize" | "s-resize" | "w-resize" | "text" | "wait" | "help" | Inherit;
    }
    interface HasFill {
        fill: Paint;
        "fill-opacity": number | Inherit;
        "fill-rule": "nonzero" | "evenodd" | Inherit;
    }
    interface HasOpacity {
        opacity: number | Inherit;
    }
    type DashArray = (Length | Percentage)[];
    interface HasStroke {
        stroke: Paint;
        "stroke-dasharray": None | DashArray | Inherit;
        "stroke-dashoffset": Percentage | Length | Inherit;
        "stroke-linecap": "butt" | "round" | "square" | Inherit;
        "stroke-linejoin": "miter" | "round" | "bevel" | Inherit;
        "stroke-miterlimit": number | Inherit;
        "stroke-opacity": number | Inherit;
        "stroke-width": Length | Percentage | Inherit;
    }
    interface HasVisibility {
        visibility: "visible" | "hidden" | "collapse" | Inherit;
    }
}
declare namespace SavageDOM.Attribute {
    class Box implements Attribute<Box> {
        x: Length;
        y: Length;
        width: Length;
        height: Length;
        constructor(x: Length, y: Length, width: Length, height: Length);
        toString(): string;
        parse(css: string | null): Box;
        get(element: Element<SVGElement, any, any>, attr: string): Box;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Box): void;
        interpolate(from: Box, t: number): Box;
    }
}
declare namespace SavageDOM.Attribute {
    const _lerp: (a: number, b: number, t: number) => number;
    type InterpolationMode = "rgb" | "hsl-shortest" | "hsl-longest" | "hsl-clockwise" | "hsl-counterclockwise";
    class Color implements Attribute<Color> {
        static DEFAULT_MODE: InterpolationMode;
        mode: InterpolationMode;
        private impl;
        constructor();
        constructor(css: string);
        constructor(format: "rgb", r: number, g: number, b: number, a?: number);
        constructor(format: "hsl", h: number, s: number, l: number, a?: number);
        toString(): string;
        parse(css: string | null): Color;
        get(element: Element<SVGElement, any, any>, attr: string): Color;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Color): void;
        interpolate(from: Color, t: number): Color;
    }
}
declare namespace SavageDOM.Attribute {
    interface ColorMatrix {
        type: "matrix" | "saturate" | "hueRotate" | "luminanceToAlpha";
        toString(): string;
    }
    namespace ColorMatrix {
        class Raw implements ColorMatrix, Attribute<Raw> {
            type: "matrix";
            arr: number[];
            constructor(values?: number[][]);
            parse(css: string | null): Raw;
            get(element: Element<SVGElement, any, any>, attr: string): Raw;
            set(element: Element<SVGElement, any, any>, attr: string, override?: Raw): void;
            interpolate(from: Matrix, t: number): Raw;
        }
        class Saturate implements ColorMatrix, Attribute<Saturate> {
            value: number;
            type: "saturate";
            constructor(value?: number);
            toString(): string;
            parse(css: string | null): Saturate;
            get(element: Element<SVGElement, any, any>, attr: string): Saturate;
            set(element: Element<SVGElement, any, any>, attr: string, override?: Saturate): void;
            interpolate(from: Saturate, t: number): Saturate;
        }
        class HueRotate implements ColorMatrix, Attribute<HueRotate> {
            value: number;
            type: "hueRotate";
            constructor(value?: number);
            toString(): string;
            parse(css: string | null): HueRotate;
            get(element: Element<SVGElement, any, any>, attr: string): HueRotate;
            set(element: Element<SVGElement, any, any>, attr: string, override?: HueRotate): void;
            interpolate(from: HueRotate, t: number): HueRotate;
        }
        class LuminanceToAlphaColorMatrix implements ColorMatrix {
            type: "luminanceToAlpha";
            toString(): string;
        }
    }
}
declare namespace SavageDOM.Attribute {
    type CSSAbsoluteLength = "px" | "in" | "cm" | "mm" | "pt" | "pc";
    type CSSRelativeLength = "em" | "ex";
    type CSSAngleUnit = "deg" | "grad" | "rad" | "turn";
    class Dimension<Unit extends string> implements Attribute<Dimension<Unit>> {
        value: number;
        unit: Unit;
        private static convert;
        constructor(value: number, unit: Unit);
        toString(): string;
        parse(css: string | null): Dimension<Unit>;
        get(element: Element<SVGElement, any, any>, attr: string): Dimension<Unit>;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Dimension<Unit>): void;
        interpolate(from: Dimension<Unit>, t: number): Dimension<Unit>;
    }
    class Percentage extends Dimension<"%"> {
        constructor(value: number);
    }
}
declare namespace SavageDOM.Attribute {
    class Matrix implements Attribute<Matrix> {
        arr: number[];
        constructor(values: number[][]);
        toString(): string;
        parse(css: string | null): Matrix;
        get(element: Element<SVGElement, any, any>, attr: string): Matrix;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Matrix): void;
        interpolate(from: Matrix, t: number): Matrix;
    }
}
declare namespace SavageDOM.Attribute {
    class NumberOptionalNumber implements Attribute<NumberOptionalNumber> {
        n: number;
        o: number;
        constructor(n: number, o?: number);
        toString(): string;
        parse(css: string | null): NumberOptionalNumber;
        get(element: Element<SVGElement, any, any>, attr: string): NumberOptionalNumber;
        set(element: Element<SVGElement, any, any>, attr: string, override?: NumberOptionalNumber): void;
        interpolate(from: NumberOptionalNumber, t: number): NumberOptionalNumber;
    }
}
declare namespace SavageDOM.Attribute {
    class Point implements Attribute<Point> {
        x: Length;
        y: Length;
        constructor(x: Length, y: Length);
        toString(): string;
        parse(css: string | null): Point;
        get(element: Element<SVGElement, any, any>, attr: string): Point;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Point): void;
        interpolate(from: Point, t: number): Point;
    }
}
declare namespace SavageDOM.Attribute {
    class PreserveAspectRatio {
        x: "Min" | "Mid" | "Max";
        y: "Min" | "Mid" | "Max";
        meetOrSlice: "meet" | "slice";
        constructor();
        constructor(x: "Min" | "Mid" | "Max", y: "Min" | "Mid" | "Max");
        constructor(x: "Min" | "Mid" | "Max", y: "Min" | "Mid" | "Max", meetOrSlice: "meet" | "slice");
        toString(): string;
    }
}
declare namespace SavageDOM.Attribute {
    abstract class Transform implements Attribute<Transform> {
        type: "matrix" | "translate" | "scale" | "rotate" | "skewX" | "skewY";
        constructor(type: "matrix" | "translate" | "scale" | "rotate" | "skewX" | "skewY");
        abstract args(): string;
        toString(): string;
        abstract parseArgs(args: string | null): Transform;
        parse(css: string | null): Transform;
        get(element: Element<SVGElement, any, any>, attr: string): Transform;
        set(element: Element<SVGElement, any, any>, attr: string, override?: Transform): void;
        abstract interpolate<T extends Transform>(from: T, t: number): T;
    }
    namespace Transform {
        class Matrix extends Transform {
            a: number;
            b: number;
            c: number;
            d: number;
            e: number;
            f: number;
            constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
            args(): string;
            parseArgs(css: string | null): Matrix;
            interpolate(from: Matrix, t: number): Matrix;
        }
        class Translate extends Transform {
            x: number;
            y: number;
            constructor(x?: number, y?: number);
            args(): string;
            parseArgs(css: string | null): Translate;
            interpolate(from: Translate, t: number): Translate;
        }
        class UniformScale extends Transform {
            s: number;
            constructor(s?: number);
            args(): string;
            parseArgs(css: string | null): UniformScale;
            interpolate(from: UniformScale, t: number): UniformScale;
        }
        class Scale extends Transform {
            x: number;
            y: number;
            constructor(x?: number, y?: number);
            args(): string;
            parseArgs(css: string | null): Scale;
            interpolate(from: Scale, t: number): Scale;
        }
        class Rotate extends Transform {
            a: number;
            x: number;
            y: number;
            constructor(a: number, x?: number, y?: number);
            args(): string;
            parseArgs(css: string | null): Rotate;
            interpolate(from: Rotate, t: number): Rotate;
        }
        class SkewX extends Transform {
            a: number;
            constructor(a?: number);
            args(): string;
            parseArgs(css: string | null): SkewX;
            interpolate(from: SkewX, t: number): SkewX;
        }
        class SkewY extends Transform {
            a: number;
            constructor(a?: number);
            args(): string;
            parseArgs(css: string | null): SkewY;
            interpolate(from: SkewY, t: number): SkewY;
        }
    }
    interface Transformable {
        "transform.matrix": Transform.Matrix;
        "transform.translate": Transform.Translate;
        "transform.uniformScale": Transform.UniformScale;
        "transform.scale": Transform.Scale;
        "transform.rotate": Transform.Rotate;
        "transform.skewX": Transform.SkewX;
        "transform.skewY": Transform.SkewY;
        transform: Transform[];
    }
}
declare namespace SavageDOM.Attribute {
    class NumberWrapper implements Attribute<NumberWrapper | number> {
        n: number;
        constructor(n?: number);
        toString(): string;
        parse(css: string | null): NumberWrapper;
        get(element: Element<SVGElement, any, any>, attr: string): NumberWrapper;
        set(element: Element<SVGElement, any, any>, attr: string, override?: NumberWrapper): void;
        interpolate(from: NumberWrapper, t: number): NumberWrapper;
    }
    class ArrayWrapper<T extends Attribute<T>> implements Attribute<ArrayWrapper<T>> {
        arr: T[];
        constructor(arr?: T[]);
        toString(): string;
        parse(css: string | null): ArrayWrapper<T>;
        get(element: Element<SVGElement, any, any>, attr: string): ArrayWrapper<T>;
        set(element: Element<SVGElement, any, any>, attr: string, override?: ArrayWrapper<T>): void;
        interpolate(from: ArrayWrapper<T>, t: number): ArrayWrapper<T>;
    }
}
declare namespace SavageDOM.Events {
    interface Mouse {
        activate: MouseEvent;
        click: MouseEvent;
        mousedown: MouseEvent;
        mousemove: MouseEvent;
        mouseout: MouseEvent;
        mouseover: MouseEvent;
        mouseup: MouseEvent;
    }
    interface SVG {
        SVGLoad: Event;
        SVGUnload: Event;
        SVGAbort: Event;
        SVGError: Event;
        SVGResize: Event;
        SVGScroll: Event;
        SVGZoom: SVGZoomEvent;
    }
    interface Touch {
        touchstart: TouchEvent;
        touchend: TouchEvent;
        touchmove: TouchEvent;
        touchcancel: TouchEvent;
    }
    interface Focus {
        focusin: FocusEvent;
        focusout: FocusEvent;
    }
}
declare namespace SavageDOM {
    class Paper {
        root: SVGSVGElement;
        defs: Element<SVGDefsElement, any, any>;
        constructor();
        constructor(id: string);
        constructor(el: SVGSVGElement);
        addDef(def: Element<SVGElement, any, any>): void;
    }
}
declare namespace SavageDOM {
    class Element<SVG extends SVGElement, Attrs, Events> {
        paper: Paper;
        private _id;
        protected _node: SVG;
        protected _style: CSSStyleDeclaration;
        constructor(paper: Paper, el: SVG, attrs?: Partial<Attrs>);
        constructor(paper: Paper, name: string, attrs?: Partial<Attrs>, id?: string);
        constructor(paper: Paper, el: string | SVG, attrs?: Partial<Attrs>, id?: string);
        readonly id: string;
        toString(): string;
        setAttribute<Attr extends keyof Attrs>(name: Attr, val: Attrs[Attr]): void;
        setAttributes(attrs: Partial<Attrs>): void;
        getAttribute<Attr extends keyof Attrs>(name: Attr): string | null;
        copyStyleFrom(el: Element<SVGElement, Attrs, any>): any;
        copyStyleFrom(el: Element<SVGElement, Attrs, any>, includeExclude: {
            [A in keyof Attrs]: boolean;
        }, defaultInclude: boolean): any;
        addEventListener<Event extends keyof Events>(event: Event, listener: (this: this, event: Events[Event]) => any): void;
        readonly boundingBox: Attribute.Box;
        add(el: Element<SVGElement, any, any> | SVGElement): void;
        getChildren(): Element<SVGElement, any, any>[];
        clone(deep?: boolean, id?: string): Element<SVG, Attrs, Events>;
        protected cloneNode(deep?: boolean): SVG;
    }
}
declare namespace SavageDOM {
    interface Dynamic<Attrs> {
        element: Element<SVGElement, Attrs, any>;
        defs: Dynamic.Defined<Attrs>;
        progress: (now: number) => number | undefined;
    }
    namespace Dynamic {
        interface Definition<A extends string> extends Setter {
            set(element: Element<SVGElement, any, any>, attr: A): void;
        }
        type Defined<Attrs> = {
            [A in keyof Attrs]?: Dynamic.Definition<A>;
        };
        class MousePosition<A extends string> extends Attribute.Point implements Definition<A> {
            private xAttr;
            private yAttr;
            constructor(target?: Document | HTMLElement | SVGElement | Paper);
        }
    }
    interface Animation<Attrs> extends Dynamic<Attrs> {
        from: Partial<Attrs>;
        attrs: Animation.Defined<Attrs>;
        resolve: (end: number) => any;
    }
    namespace Animation {
        type Defined<Attrs> = {
            [A in keyof Attrs]?: Attribute<Attrs[A]>;
        };
        namespace Easing {
            const cubicBezier: (p1x: number, p1y: number, p2x: number, p2y: number) => (x: number) => number;
            const linear: (t: number) => number;
            const quadraticIn: (t: number) => number;
            const quadraticOut: (t: number) => number;
            const quadratic: (t: number) => number;
            const cubicIn: (t: number) => number;
            const cubicOut: (t: number) => number;
            const cubic: (t: number) => number;
            const quarticIn: (t: number) => number;
            const quarticOut: (t: number) => number;
            const quartic: (t: number) => number;
            const quinticIn: (t: number) => number;
            const quinticOut: (t: number) => number;
            const quintic: (t: number) => number;
            const sineIn: (t: number) => number;
            const sineOut: (t: number) => number;
            const sine: (t: number) => number;
            const exponentialIn: (t: number) => number;
            const exponentialOut: (t: number) => number;
            const exponential: (t: number) => number;
            const circularIn: (t: number) => number;
            const circularOut: (t: number) => number;
            const circular: (t: number) => number;
            const backIn: (t: number) => number;
            const backOut: (t: number) => number;
            const back: (t: number) => number;
            const elasticIn: (t: number) => number;
            const elasticOut: (t: number) => number;
            const elastic: (t: number) => number;
        }
    }
    class AnimationRunner {
        static getInstance(): AnimationRunner;
        private static _instance;
        private static requestAnimationFrame;
        private running;
        private queue;
        private hooks;
        registerDynamic<SVG extends SVGElement, Attrs>(element: Element<SVG, Attrs, any>, defs: Dynamic.Defined<Attrs>): (enable: boolean) => void;
        registerDynamic<SVG extends SVGElement, Attrs>(element: Element<SVG, Attrs, any>, defs: Dynamic.Defined<Attrs>, isEnabled: () => boolean): void;
        registerAnimation<SVG extends SVGElement, Attrs>(element: Element<SVG, Attrs, any>, attrs: Animation.Defined<Attrs>, duration: number, easing: (t: number) => number): Promise<number>;
        add(anim: Dynamic<any>): void;
        addAnimationFrameHook(hook: (now: number) => void): void;
        removeAnimationFrameHook(hook: (now: number) => void): void;
        private registerAnimationWithCallback<SVG, Attrs>(element, attrs, duration, easing, resolve);
        private loop();
        private stop();
        private start();
    }
    interface Element<SVG extends SVGElement, Attrs, Events> {
        dynamic(defs: Dynamic.Defined<Attrs>): void;
        animate(attrs: Partial<Attrs>, duration: number, easing?: (t: number) => number): Promise<number>;
    }
}
