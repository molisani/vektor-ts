
import { Observable, operators } from "rxjs";
import { BaseAttributes, HasClass, HasColor, HasColorInterpolation, HasColorRendering, HasCursor, HasOpacity, HasStyle, HasVisibility, Inherit, None } from "../attributes/base";
import { Transformable } from "../attributes/transform";
import { Element } from "../element";
import { BaseEvents, Focus_Events, Mouse_Events, PointEvent, SVG_Events } from "../events";
import { HasFilter } from "./filter";
import { HasClipPath } from "./non-renderables/clip-path";
import { HasMask } from "./non-renderables/mask";

export interface Renderable_Attributes extends HasStyle, HasClass, HasColor, Transformable {
  "display": "inline" | "block" | "list-item" | "run-in" | "compact" | "marker" | "table" | "inline-table" | "table-row-group" | "table-header-group" | "table-footer-group" | "table-row" | "table-column-group" | "table-column" | "table-cell" | "table-caption" | None | Inherit;
  "pointer-events": "visiblePainted" | "visibleFill" | "visibleStroke" | "visible" | "painted" | "fill" | "stroke" | "all" | None | Inherit;
}

export interface Containers_Attributes extends HasFilter, HasColorInterpolation, HasColorRendering, HasCursor, HasClipPath, HasMask {}

export interface Graphics_Attributes extends HasFilter, HasColorInterpolation, HasColorRendering, HasCursor, HasClipPath, HasMask, HasOpacity, HasVisibility {
  "pointer-events": "visiblePainted" | "visibleFill" | "visibleStroke" | "visible" | "painted" | "fill" | "stroke" | "all" | None | Inherit;
}

export interface Renderable_Events extends Mouse_Events, SVG_Events, Focus_Events {}

export abstract class AbstractRenderable<E extends SVGGraphicsElement, A extends BaseAttributes, V extends BaseEvents> extends Element<E, Renderable_Attributes & A, Renderable_Events & V> {
  public getPointEvent(events: string): Observable<PointEvent> {
    return this.getEvent(events).pipe(operators.map((event: MouseEvent | TouchEvent) => {
      const action: MouseEvent | Touch = (event instanceof MouseEvent) ? event : event.touches[0];
      const ref = this.context.refPoint;
      ref.x = action.clientX;
      ref.y = action.clientY;
      const matrix = this.node.getScreenCTM();
      if (!matrix) {
        throw new Error(`No Screen Coordinate Transform Matrix found for node "${this.node.id}"`);
      }
      const local = ref.matrixTransform(matrix.inverse());
      return {
        local: {
          x: local.x,
          y: local.y,
        },
        page: {
          x: action.pageX,
          y: action.pageY,
        },
        screen: {
          x: action.screenX,
          y: action.screenY,
        },
      };
    }));
  }
}
