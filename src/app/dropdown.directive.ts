import { Directive, HostListener, ElementRef, Renderer2} from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective{
  isOpen = false;

  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
    this.addClass();
  }

  addClass() {
    if(this.isOpen)
    {
        this.renderer.addClass(this.elRef.nativeElement.children[1], 'show');
    } else {
        this.renderer.removeClass(this.elRef.nativeElement.children[1], 'show');
    }
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
}
