import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopupConfig} from './popup-config';

@Component({
    selector: 'base-popup',
    templateUrl: './base-popup.component.html',
    styleUrls: ['./base-popup.component.less']
})
export class BasePopupComponent implements OnInit {

    /**
     * 标题
     */
    @Input() title = '';

    @Input() showPopupFooter = true;

    /**
     * 显示遮罩层
     */
    _showMask;
    get showMask() {
        if (this._showMask === undefined) {
            return this.popupConfig.showMask;
        }
        return this._showMask;
    }

    @Input() set showMask(_showMask) {
        this._showMask = _showMask;
    }

    /**
     * 遮罩层点击事件
     */
    _maskCloseEvent;
    get maskCloseEvent() {
        if (this._maskCloseEvent === undefined) {
            return this.popupConfig.maskCloseEvent;
        }
        return this._maskCloseEvent;
    }

    @Input() set maskCloseEvent(_maskCloseEvent) {
        this._maskCloseEvent = _maskCloseEvent;
    }

    /**
     * 遮罩层颜色
     */
    _maskColor;
    get maskColor() {
        if (this._maskColor === undefined) {
            return this.popupConfig.maskColor;
        }
        return this._maskColor;
    }

    @Input() set maskColor(_maskColor) {
        this._maskColor = _maskColor;
    }

    /**
     * 宽度
     */
    _width: string | number;
    get width() {
        let w = this._width;
        if (w === undefined) {
            w = this.popupConfig.width;
        }
        if (typeof w === 'string' && w.endsWith('%')) {
            const v = parseFloat(w.replace('%', ''));
            w = (v * window.innerWidth / 100) + 'px';
        }
        if (typeof w === 'number' || !w.endsWith('px')) {
            w = w + 'px';
        }
        return w;
    }

    @Input() set width(_width: string | number) {
        this._width = _width;
    }

    /**
     * 高度
     */
    _height: string | number;
    get height() {
        let h: string | number = this._height;
        if (h === undefined) {
            h = this.popupConfig.height;
        }
        if (typeof h === 'string' && h.endsWith('%')) {
            const v = parseFloat(h.replace('%', ''));
            h = (v * window.innerHeight / 100) + 'px';
        }
        if (typeof h === 'number' || !h.endsWith('px')) {
            h = h + 'px';
        }
        return h;
    }

    @Input() set height(_height: string | number) {
        this._height = _height;
    }


    /**
     * 上
     */
    _top: string | number;
    get top() {
        if (this._top === undefined) {
            return this.popupConfig.top;
        }
        return this._top;
    }

    @Input() set top(_top) {
        this._top = _top;
    }

    /**
     * 左
     */
    _left: string | number;
    get left() {
        if (this._left === undefined) {
            return this.popupConfig.left;
        }
        return this._left;
    }

    @Input() set left(_left) {
        this._left = _left;
    }

    @Output() closeClick = new EventEmitter();

    clickMask() {
        if (this.maskCloseEvent) {
            this.closeBtn();
        }
    }

    closeBtn() {
        this.closeClick.emit();
    }

    constructor(private popupConfig: PopupConfig) {
    }

    ngOnInit() {
    }


}
