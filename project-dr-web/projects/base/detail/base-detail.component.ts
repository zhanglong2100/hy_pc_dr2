import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SFButton, SFComponent, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseService, Page, ReturnForm} from '@sb/base/core';
import {STData} from '@delon/abc';
import {Observable} from 'rxjs';

@Component({
    selector: 'base-detail',
    templateUrl: './base-detail.component.html',
    styleUrls: ['./base-detail.component.less']
})
export class BaseDetailComponent implements OnInit, AfterViewInit {

    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    @Input() commitWrapper: (value: STData) => STData;

    /**
     * todo 此处要修改, 不允许传递此方法. 后期修改
     */
    @Input() recordWrapper: (value: STData) => STData | Observable<STData>;

    @Input() beforeDataSubmit: (data: STData[]) => STData[];

    @Input() schema: SFSchema;

    @Input() baseParam: { [key: string]: any; };

    @Input() name = '';

    @Input() usePopup = true;

    @Input() afterInit: (sf: SFComponent) => void;

    @Input()
    customCommitMethod: (page: STData, baseService?: BaseService<STData, Page>) => Observable<ReturnForm<any>>;

    private _showButton = true;
    @Input()
    set showButton(_showButton) {
        this._showButton = _showButton;
    }

    get showButton() {
        return this._showButton;
    }

    @Output() formChangeEvent = new EventEmitter<STData>();

    // 面板标题
    @Input() detailPanelType: 'add' | 'modify' = 'add';

    // 表单数据
    _record: STData;


    @ViewChild(SFComponent, {static: false})
    sf: SFComponent;


    get record() {
        return this._record;
    }

    @Input()
    set record(record: STData) {
        record = Object.assign({}, record);
        if (this.recordWrapper) {
            let newRecord = this.recordWrapper(record);
            if (newRecord && newRecord instanceof Observable) {
                newRecord.subscribe(v => {
                    this._record = v;
                })
            } else {
                this._record = newRecord;
            }
        } else {
            this._record = record;
        }
    }

    detailButton: SFButton = {
        render: {
            class: 'text-center',
            grid: {
                span: 24
            }
        }
    };

    @Input() width: number | string;

    @Input() height: number | string;

    get detailPanelTitle() {
        if (this.showButton) {
            return (this.detailPanelType === 'add' ? '新增' : '修改') + this.name + '窗口';
        } else {
            return '查看' + this.name + '窗口';
        }
    }

    @Output() eventClose = new EventEmitter<boolean>();

    constructor(
        private message: NzMessageService,
        private baseService: BaseService<STData, Page>,
    ) {
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        if (this.afterInit) {
            this.afterInit(this.sf);
        }
    }

    /**
     * 提交表单
     */
    submit() {
        let value = this.sf.value;
        if (this.baseParam) {
            value = Object.assign({}, this.baseParam, value);
        }

        if (this.commitWrapper) {
            value = this.commitWrapper(value);
        }

        let o;
        if (this.customCommitMethod) {
            o = this.customCommitMethod(value, this.baseService);
        } else {
            o = this.baseService.commit(value);
        }

        o.subscribe((returnForm: ReturnForm<any>) => {
            if (returnForm.success) {
                this.message.success('保存成功！');
                if (this.beforeDataSubmit) {
                    this.beforeDataSubmit(returnForm.message);
                }
                this.eventClose.emit(true);
            } else {
                this.message.error(returnForm.errorMessage);
            }
        });
    }

    formChange(value: STData) {
        this.formChangeEvent.emit(value);
    }

    /**
     * 关闭窗口
     */
    closeClick(value) {
        this.eventClose.emit(value);
    }
}
