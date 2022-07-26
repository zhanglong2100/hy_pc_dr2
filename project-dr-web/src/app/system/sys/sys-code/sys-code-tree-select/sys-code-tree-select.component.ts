import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {SysCodeService} from '../service/sys-code.service';
import {ComboBoxTreeNode} from '@sb/base/core/entity/combo-box-tree-node';
import {NzFormatEmitEvent, NzMessageService, NzTreeComponent} from 'ng-zorro-antd';


@Component({
    selector: 'sys-code-tree-select',
    templateUrl: './sys-code-tree-select.component.html',
    styleUrls: ['./sys-code-tree-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SysCodeTreeSelectComponent),
            multi: true
        }
    ]
})
export class SysCodeTreeSelectComponent implements OnInit, ControlValueAccessor {

    @ViewChild("nzTree", {static: true})
    nzTree: NzTreeComponent;

    @Input()
    category: string;

    codeValues: ComboBoxTreeNode[] = [];

    nzDropdownStyle = {
        width: '300px',
        "overflow-x": "hidden",
        "min-height": "200px"
    }

    @Input()
    valueChange: (value: string | string[] | object) => any;

    _value;

    get value() {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        if (this.changeFn) {
            this.changeFn(value);
        }
    }

    changeFn = undefined;
    disabled = false;


    constructor(protected sysCodeService: SysCodeService,
                protected message: NzMessageService,
                @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.updateCodes();

    }

    updateCodes() {
        if (!this.category) {
            this.codeValues = [];
            this.cd.detectChanges();
        }
        this.sysCodeService.getCustomComboBoxNzTree(this.category).subscribe(returnForm => {
            if (returnForm.success) {
                this.codeValues = returnForm.message;
                this.cd.detectChanges();
            } else {
                this.message.error("加载节点数据异常：" + returnForm.errorMessage);
            }
        });
    }

    reloadNode(nodeId: string) {
        const node = this.nzTree.getTreeNodeByKey(nodeId);
        node.isLeaf = false;
        node.isExpanded = true;
        this.sysCodeService.getCustomComboBoxNzTree(this.category, nodeId).subscribe(returnForm => {
            if (returnForm.success) {
                node.clearChildren();
                node.addChildren(returnForm.message);
                node.isLeaf = returnForm.message.length === 0;
            } else {
                this.message.error("加载节点数据异常：" + returnForm.errorMessage);
            }
        });
    }

    onExpandChange(e: NzFormatEmitEvent) {
        let node = e.node;
        if (node && node.getChildren().length === 0 && node.isExpanded) {
            this.reloadNode(node.key);
        }
    }

    registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(_value: any): void {
        if (!_value) {
            return;
        }
    }
}
