import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzFormatEmitEvent, NzMessageService, NzTreeComponent} from 'ng-zorro-antd';
import {RmFunctionTreeService} from '../service/rm-function-tree.service';
import {RmFunctionTreeNode} from '../entity/rm-function-tree-node';
import {RmFunctionSearchConfig} from '../entity/rm-function-search-config';


@Component({
    selector: 'rm-function-tree-select',
    templateUrl: './rm-function-tree-select.component.html',
    styleUrls: ['./rm-function-tree-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RmFunctionTreeSelectComponent),
            multi: true
        }
    ]
})
export class RmFunctionTreeSelectComponent implements OnInit, ControlValueAccessor {

    @ViewChild('nzTree', {static: true})
    nzTree: NzTreeComponent;

    treeData: RmFunctionTreeNode[] = [];

    @Input() parentId = '-1';

    @Input() maxLevel = -1;

    searchConfig: RmFunctionSearchConfig = {
        searchEmptyModule: false,
        searchEmptyServer: false,
        searchPermission: false
    };

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


    constructor(protected functionTreeService: RmFunctionTreeService,
                protected message: NzMessageService,
                @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.functionTreeService.getNzTree(this.searchConfig.parentId, this.searchConfig).subscribe(returnForm => {
            if (returnForm.success) {
                this.treeData = returnForm.message;
                this.cd.detectChanges();
            } else {
                this.message.error('加载节点数据异常：' + returnForm.errorMessage);
            }
        });
    }

    reloadNode(nodeId: string) {
        const node = this.nzTree.getTreeNodeByKey(nodeId);
        node.isLeaf = false;
        node.isExpanded = true;
        this.functionTreeService.getNzTree(nodeId, this.searchConfig).subscribe(returnForm => {
            if (returnForm.success) {
                node.clearChildren();
                node.addChildren(returnForm.message);
                node.isLeaf = returnForm.message.length === 0;
            } else {
                this.message.error('加载节点数据异常：' + returnForm.errorMessage);
            }
        });
    }

    onExpandChange(e: NzFormatEmitEvent) {
        const node = e.node;
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
        this.value = _value;
    }

    getIcon(node: RmFunctionTreeNode): string {
        if (node.type === 'root') {
            return 'dr:hy-root';
        } else if (node.type === 'SERVER') {
            return 'dr:hy-server';
        } else if (node.type === 'FUNCTION') {
            return 'dr:hy-func';
        } else if (node.type === 'MODULE') {
            return 'dr:hy-module';
        }
    }
}
