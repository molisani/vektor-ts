import { Context } from "../../context";
import { makeRequest, SVGDocument } from "../../document";
import { Renderable_Attributes } from "../renderable";
import { Component } from "./component";
import { Group } from "./group";

export class ExternalSVG extends Group {
  constructor(context: Context, doc: SVGDocument, attrs?: Partial<Renderable_Attributes>) {
    super(context, attrs);
    doc.children.forEach((child) => {
      const importedNode = context.window.document.importNode(child, true);
      this.add(importedNode);
    });
  }
}

export declare class ExternalComponent extends Component {
  constructor(onLoaded: () => void);
}

export function buildExternalComponentClass(url: string, origin: { x: number, y: number } = { x: 0, y: 0 }): typeof ExternalComponent {
  const xmlDocument_p = makeRequest("GET", url);
  const context_p = Context.contexts.take(1).toPromise();
  const doc_p = Promise.all([context_p, xmlDocument_p]).then(([context, xml]) => {
    return new SVGDocument(context, xml);
  });
  return class extends Component {
    constructor(onLoaded: () => void) {
      super(origin);
      doc_p.then((doc) => {
        doc.children.forEach((child) => {
          const importedNode = this.context.window.document.importNode(child, true);
          this.add(importedNode);
        });
        onLoaded();
      });
      this._node.setAttribute("data-source-url", url);
    }
  };
}
