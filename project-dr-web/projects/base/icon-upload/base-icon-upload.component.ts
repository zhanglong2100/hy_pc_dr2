import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit,} from '@angular/core';

import {NzMessageService, UploadChangeParam} from "ng-zorro-antd";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable, Observer} from "rxjs";

@Component({
    selector: 'base-icon-upload',
    templateUrl: './base-icon-upload.component.html',
    styleUrls: ['./base-icon-upload.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BaseIconUploadComponent),
            multi: true
        }
    ]
})

export class BaseIconUploadComponent implements OnInit, ControlValueAccessor {

    //Icon上传div宽
    @Input() width: string = '60px';

    //Icon上传div高
    @Input() height: string = '40px';

    fileType: string[] = ['image/jpeg', 'image/png', 'image/jpgv', 'image/jpg', 'image/svg+xml'];

    _value;

    changeFn = undefined;

    constructor(
        public message: NzMessageService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
    }

    get value() {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        if (this.changeFn) {
            this.changeFn(value);
        }
    }

    ngOnInit(): void {

    }

    //自定义提交
    customUpload(item) {
        let reader = new FileReader();
        reader.readAsDataURL(item.file);
        reader.onload = () => {
            const base64Value = <string>reader.result;
            if (base64Value.indexOf('svg+xml') >= 0) {
                const img = new Image();
                img.src = base64Value;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const context = canvas.getContext('2d');
                    context.drawImage(img, 0, 0);
                    this.value = canvas.toDataURL('image/png');
                }
            } else {
                this.value = base64Value;
            }
        }
    };

    beforeUpload(file: File) {
        return new Observable((observer: Observer<boolean>) => {
            const isJPG = this.fileType.indexOf(file.type) >= 0;
            if (!isJPG) {
                this.message.info("不支持该格式文件上传");
                return;
            }
            if (file.size > 1024 * 100) {
                this.message.info("图标大小超过100kb , 不支持上传");
                return;
            }
            observer.next(isJPG);
        });
    };

    handleChange(info: UploadChangeParam): void {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            if (info.file.response.success) {
                this.value = info.file.response.message
            }
        } else if (info.file.status === 'error') {

        }
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {

    }

    writeValue(_value: any): void {
        this._value = _value;
    }
}
