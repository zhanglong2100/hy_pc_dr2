import {
    AfterContentInit,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {STData} from "@delon/abc";

@Component({
    selector: 'base-modal',
    templateUrl: './base-modal.component.html',
    styleUrls: ['./base-modal.component.css']
})
export class BaseModalComponent implements AfterContentInit {
    @ContentChild('header', {static: true}) content: ElementRef;

    isVisible = false;

    @ViewChild('outerContent', {static: true}) outerContent: ElementRef;
    @ViewChild('modalContent', {static: true}) modalContent: ElementRef;

    @Output() handleCancelAfter = new EventEmitter<STData>();

    constructor(private elementRef: ElementRef,
                private renderer2: Renderer2) {
    }

    ngAfterContentInit() {
        // this.renderer.setElementStyle(this.outerContent.nativeElement, 'backgroundColor', 'red');
    }

    public showModal(): void {
        // this.outerContent.nativeElement;
        // const content: any = this.renderer2.selectRootElement(this.outerContent.nativeElement);
        const c: Array<any> = this.outerContent.nativeElement.childNodes;
        for (let i = 0; i < c.length; i++) {
            this.renderer2.appendChild(this.modalContent.nativeElement, c[i]);
        }
        this.isVisible = true;
    }

    handleOk(): void {
        this.isVisible = false;
    }

    handleCancel(): void {
        const c: Array<any> = this.modalContent.nativeElement.childNodes;
        for (let i = 0; i < c.length; i++) {
            this.renderer2.appendChild(this.outerContent.nativeElement, c[i]);
        }
        this.isVisible = false;
        this.handleCancelAfter.emit();
    }
}
