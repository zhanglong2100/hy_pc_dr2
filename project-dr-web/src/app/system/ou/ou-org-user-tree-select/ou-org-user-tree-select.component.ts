import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {OuOrgService} from '../ou-org/service/ou-org.service';
import {NzFormatEmitEvent, NzMessageService, NzTreeComponent} from 'ng-zorro-antd';
import {OuOrgSearchConfig} from '../ou-org/entity/ou-org-search-config';


@Component({
    selector: 'ou-org-user-tree-select',
    templateUrl: './ou-org-user-tree-select.component.html',
    styleUrls: ['./ou-org-user-tree-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OuOrgUserTreeSelectComponent),
            multi: true
        }
    ]
})
export class OuOrgUserTreeSelectComponent implements OnInit, ControlValueAccessor {

    @ViewChild("nzTree", {static: true})
    nzTree: NzTreeComponent;

    nodes = [];

    nzDropdownStyle = {
        'width': '400px',
        "overflow-x": "hidden",
        "min-height": "200px"
    };

    @Input()
    rootOrgId = "-1";

    /**
     * 查询子机构
     */
    @Input()
    searchConfig?: OuOrgSearchConfig;

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


    constructor(protected ouOrgService: OuOrgService,
                protected message: NzMessageService,
                @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.updateCodes();
    }

    updateCodes() {
        this.ouOrgService.getNzTree(this.rootOrgId || "-1", this.searchConfig, -1).subscribe(returnForm => {
            if (returnForm.success) {
                this.nodes = returnForm.message;
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
        this.ouOrgService.getNzTree(node.key).subscribe(returnForm => {
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
        this.value = _value;
    }
}
