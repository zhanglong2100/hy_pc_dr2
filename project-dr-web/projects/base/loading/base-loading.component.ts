import {AfterContentChecked, Component, ContentChild, ElementRef, Input, Renderer2} from '@angular/core';

@Component({
    selector: 'base-loading',
    templateUrl: './base-loading.component.html',
    styleUrls: ['./base-loading.component.css']
})
export class BaseLoadingComponent implements AfterContentChecked {

    _hideLoading = false;
    _height = 0;
    _width = '';
    private manualSetHeight = false;

    @ContentChild('cContent', {static: true}) cContent: ElementRef;

    @Input()
    set hideLoading(v: boolean) {
        this._hideLoading = v;
    }

    @Input()
    set height(v: number) {
        this._height = v;
        this.manualSetHeight = true;
    }

    @Input()
    set width(v: string) {
        this._width = v;
    }

    getLineHeight(): number {
        return this._height - 60;
    }

    constructor(private elementRef: ElementRef,
                private renderer2: Renderer2) {
    }

    ngAfterContentChecked(): void {
        const dom = this.elementRef.nativeElement.querySelector('.loading-content');
        if (!this.manualSetHeight) {
            this._height = dom.offsetHeight;
        }
    }


}
