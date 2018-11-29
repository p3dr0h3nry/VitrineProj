import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[auto-hide]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class AutoHideDirective {
  fabToHide;
  oldScrollTop: number = 0;
  constructor(private renderer: Renderer, private element: ElementRef) {
  }
  ngOnInit() {
    if (this.element.nativeElement.getElementsByClassName('fab')[0]) {
      this.fabToHide = this.element.nativeElement.getElementsByClassName('fab')[0];
      this.renderer.setElementStyle(this.fabToHide, "webkitTransition", "transform 500ms,opacity 500ms");
    }
  }
  onContentScroll(ev) {
    if (this.element.nativeElement.getElementsByClassName('fab')[0]) {
      if (ev.scrollTop - this.oldScrollTop > 10) {

        this.renderer.setElementStyle(this.fabToHide, "opacity", "0");
        this.renderer.setElementStyle(this.fabToHide, "webkitTransform", "scale3d(.1,.1,.1)");
      } else if (ev.scrollTop - this.oldScrollTop < 0) {

        this.renderer.setElementStyle(this.fabToHide, "opacity", "1");
        this.renderer.setElementStyle(this.fabToHide, "webkitTransform", "scale3d(1,1,1)");
      }
      this.oldScrollTop = ev.scrollTop;
    }
  }
}
