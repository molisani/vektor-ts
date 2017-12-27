namespace SavageDOM.Attributes {

  export class TextContent implements Attribute<TextContent> {
    private static escapeHtml(html: string): string {
      return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    private _str: string;
    private _cb: () => string;
    constructor(str: string);
    constructor(cb: () => string);
    constructor(str: string | (() => string)) {
      if (typeof str === "string") {
        this._str = str;
      } else {
        this._cb = str;
      }
    }
    public parse(css: string | null): TextContent {
      return new TextContent(css || "");
    }
    public get<Attrs, A extends keyof Attrs>(element: Element<SVGElement, Attrs, any>, attr: A): TextContent {
      return this.parse(((element as any)._node as SVGTextElement).textContent);
    }
    public set<Attrs, A extends keyof Attrs>(element: Element<SVGElement, Attrs, any>, attr: A, override?: TextContent): void {
      ((element as any)._node as SVGTextElement).textContent = TextContent.escapeHtml(this._str || this._cb());
    }
    public interpolate(from: TextContent, t: number): TextContent {
      return t < 0.5 ? from : this;
    }
  }

}
