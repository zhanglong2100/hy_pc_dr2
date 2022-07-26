import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'base-sort',
    templateUrl: './base-sort.component.html',
    styleUrls: ['./base-sort.component.less']
})
export class BaseSortComponent implements OnInit {

    data: any[];

    showField: string;

    @Output() eventChange = new EventEmitter<any[]>();

    @Output() eventExit = new EventEmitter<boolean>();

    @Input('showField')
    set setShowField(showField: string) {
        this.showField = showField;
    }

    @Input('data')
    set setData(data: any[]) {
        const arr = [];
        for (const d of data) {
            arr.push(d);
        }
        this.data = arr;
    }

    options = {
        animation: 150,
    };

    /**
     * 取消并且隐藏弹窗
     */
    cancel() {
        this.eventExit.emit();
    }

    /**
     * 保存
     */
    submit() {
        this.eventChange.emit(this.data);
    }

    ngOnInit() {
    }

    constructor() {
    }
}
