import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseService, BaseTreeComponent} from '@sb/base';
import {SFSchema, SFTextareaWidgetSchema} from '@delon/form';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RmFunctionSearchForm} from '../entity/rm-function-search-form';
import {STColumn} from '@delon/abc';
import {RmFunction} from '../entity/rm-function';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {RmFunctionTreeService} from '../service/rm-function-tree.service';
import {RmFunctionTreeNode} from '../entity/rm-function-tree-node';
import {RmFunctionSearchConfig} from '../entity/rm-function-search-config';
import {NzTreeNode} from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import {BehaviorSubject, Observable, of} from "rxjs";

@Component({
    selector: 'rm-function',
    templateUrl: './rm-function.component.html',
    styleUrls: ['./rm-function.component.less'],
    providers: [
        {
            provide: BaseTreeService,
            useClass: RmFunctionTreeService
        },
        {
            provide: BaseService,
            useClass: RmFunctionTreeService
        }
    ]
})
export class RmFunctionComponent implements OnInit {

    typeIcon = {
        SERVER: 'dr:hy-server',
        FUNCTION: 'dr:hy-func',
        MODULE: 'dr:hy-module',
        PERMISSION: 'dr:hy-permission'
    };

    searchForm: RmFunctionSearchForm = {
        parentId: '-1'
    };

    searchConfig: RmFunctionSearchConfig = {
        searchEmptyModule: true,
        searchEmptyServer: true,
        searchPermission: true
    };

    @ViewChild(BaseGridComponent, {static: true})
    baseGrid: BaseGridComponent;

    @ViewChild(BaseTreeComponent, {static: true})
    baseTree: BaseTreeComponent;

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'id',
            width: '7%',
            className: 'text-center'
        }, {
            title: '名称',
            index: 'name',
            width: '12%',
            className: 'text-center word-wrap'
        }, {
            title: '功能编码',
            index: 'funcCode',
            iif: (item: STColumn) => this.baseTree.activatedNode.type !== 'root',
            width: '12%',
            className: 'text-center word-wrap'
        }, {
            title: '地址类型',
            index: 'urlType',
            format: (item: RmFunction) => {
                if (item.urlType === 'ABSOLUTE') {
                    return '绝对地址';
                } else if (item.urlType === 'RELATIVE') {
                    return '相对地址';
                } else {
                    return '';
                }
            },
            iif: (item: STColumn) => this.baseTree.activatedNode.type !== 'root',
            width: '12%',
            className: 'text-center word-wrap'
        }, {
            title: '功能访问地址',
            index: 'url',
            iif: (item: STColumn) => this.baseTree.activatedNode.type !== 'root',
            width: '31%',
            className: 'text-center word-wrap'
        }, {
            title: '服务地址',
            index: 'serverUrl',
            iif: (item: STColumn) => this.baseTree.activatedNode.type === 'root',
            width: '20%',
            className: 'text-center word-wrap'
        }, {
            title: '类型',
            index: 'type',
            format: v => {
                if (v.type === 'SERVER') {
                    return '服务';
                } else if (v.type === 'FUNCTION') {
                    return '功能';
                } else {
                    return '目录';
                }
            },
            width: '8%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            className: 'text-center word-wrap',
            width: '18%',
            buttons: []
        }
    ] as STColumn[];


    schema: SFSchema = {
        properties: {
            name: {
                type: 'string',
                title: '名称',
                minLength: 2
            },
            type: {
                type: 'string',
                title: '类型',
                enum: [
                    {
                        value: 'SERVER',
                        label: '服务'
                    }, {
                        value: 'FUNCTION',
                        label: '功能'
                    }, {
                        value: 'MODULE',
                        label: '目录'
                    }, {
                        value: 'PERMISSION',
                        label: '权限'
                    }
                ],
                default: 'SERVER'
            },
            serverUrl: {
                type: 'string',
                title: '服务器地址',
                ui: {
                    visibleIf: {
                        type: ['SERVER']
                    }
                }
            },
            serverDescription: {
                type: 'string',
                title: '服务器描述',
                ui: {
                    widget: 'textarea',
                    autosize: {
                        minRows: 2,
                        maxRows: 8
                    },
                    visibleIf: {
                        type: ['SERVER']
                    }
                } as SFTextareaWidgetSchema
            },
            urlType: {
                type: 'string',
                title: '地址类型',
                enum: [
                    {
                        value: 'ABSOLUTE',
                        label: '绝对地址'
                    },
                    {
                        value: 'RELATIVE',
                        label: '相对地址'
                    }
                ],
                default: 'RELATIVE',
                ui: {
                    widget: 'select',
                    visibleIf: {
                        type: ['FUNCTION']
                    }
                }
            },
            url: {
                type: 'string',
                title: '功能访问地址',
                ui: {
                    visibleIf: {
                        type: ['FUNCTION']
                    }
                }
            },
            permissionCode: {
                type: 'string',
                title: '权限编码',
                ui: {
                    visibleIf: {
                        type: ['PERMISSION']
                    }
                }
            }
        },
        required: ['name', 'type', 'funcCode', 'urlType', 'url', 'serverUrl', 'permissionCode'],
        ui: {
            spanLabelFixed: 120,
        }
    } as SFSchema;

    constructor(
        private message: NzMessageService,
        private functionService: RmFunctionTreeService,
        private modal: NzModalService) {
    }

    ngOnInit(): void {
    }

    selectNode(node: RmFunctionTreeNode): void {
        this.baseTree.activatedNode = node;
        this.loadData();
    }

    updateSchema(): void {
        if (this.baseTree.activatedNode.type === 'root') {
            this.schema.properties.type.enum = [{
                value: 'SERVER',
                label: '服务'
            }];
            this.schema.properties.type.default = 'SERVER';
        } else if (this.baseTree.activatedNode.type === 'SERVER' ||
            this.baseTree.activatedNode.type === 'MODULE') {
            this.schema.properties.type.enum = [
                {
                    value: 'MODULE',
                    label: '目录'
                },
                {
                    value: 'FUNCTION',
                    label: '功能'
                }];
            this.schema.properties.type.default = 'MODULE';
        } else if (this.baseTree.activatedNode.type === 'FUNCTION' ||
            this.baseTree.activatedNode.type === 'PERMISSION') {
            this.schema.properties.type.enum = [
                {
                    value: 'PERMISSION',
                    label: '权限'
                }];
            this.schema.properties.type.default = 'PERMISSION';
        }
    }

    loadData(): void {
        const key = this.baseTree.activatedNode.key;
        this.functionService.get(key).subscribe(
            (v) => {
                if (v.success) {
                    this.baseGrid.detailPanelType = 'modify';
                    this.baseGrid.record = v.message;
                }
            }
        );
        if (this.baseTree.activatedNode.type === 'root' ||
            this.baseTree.activatedNode.type === 'SERVER' ||
            this.baseTree.activatedNode.type === 'MODULE') {
            this.searchForm.parentId = key;
            if (this.baseGrid.showType === 'table' && this.baseGrid.st) {
                this.baseGrid.st.clear();
                this.baseGrid.st.resetColumns({emitReload: false}).then();
            }
            this.baseGrid.reload(false);
        } else {
            this.functionService.get(key).subscribe(
                (v) => {
                    if (v.success) {
                        this.baseGrid.modifyClick(v.message);
                    }
                }
            );
        }
    }

    beforeDrop(dragNode: NzTreeNode, targetNode: NzTreeNode): boolean {
        const dragNodeOptions = dragNode.origin;
        const targetNodeOptions = targetNode.origin;
        if (dragNodeOptions.type === 'root') {
            return false;
        } else if (dragNodeOptions.type === 'SERVER') {
            if (targetNodeOptions.type !== 'SERVER') {
                return false;
            }
        } else if (dragNodeOptions.type === 'MODULE' ||
            dragNodeOptions.type === 'FUNCTION') {
            if (targetNodeOptions.type !== 'MODULE' &&
                targetNodeOptions.type !== 'FUNCTION') {
                return false;
            }
        } else if (dragNodeOptions.type === 'PERMISSION') {
            if (targetNodeOptions.type !== 'PERMISSION') {
                return false;
            }
        }
        return true;
    }

    customDetailClick(data: any) {
        if (data.detailPanelType === 'add') {
            this.updateSchema();
            this.schema.properties.type.readOnly = false;
        } else {
            this.schema.properties.type.readOnly = true;
            this.schema.properties.type.enum = [
                {
                    value: 'SERVER',
                    label: '服务'
                }, {
                    value: 'FUNCTION',
                    label: '功能'
                }, {
                    value: 'MODULE',
                    label: '目录'
                }, {
                    value: 'PERMISSION',
                    label: '权限'
                }
            ];
            this.schema.properties.type.default = 'SERVER';
        }
    }

    onDataReload() {
        let parentId = this.baseTree.activatedNode.data.parentId;
        this.baseTree.reloadNode(parentId || '-1');

    }

    recordWrapper(rmFunction: RmFunction): RmFunction {
        if (this.baseTree.activatedNode.key !== rmFunction.id) {
            Object.assign(rmFunction, {parentId: this.baseTree.activatedNode.key});
        }
        return rmFunction;
    }

    beforeRemove(funcs: RmFunction[]): Observable<boolean> {
        const subject = new BehaviorSubject(false);
        for (let i = 0; i < funcs.length; i++) {
            let func = funcs[i];
            if (func.type === 'SERVER' || func.type === 'MODULE') {
                this.modal.confirm({
                    nzTitle: '删除提示',
                    nzContent: '删除服务器或目录会同时删除当前节点下的所有功能，是否确定删除?',
                    nzOnOk: () => {
                        subject.next(true);
                        subject.complete();
                    }
                }, 'warning');
                break;
            }

            if (i === funcs.length - 1) {
                return of(true);
            }
        }
        return subject;
    }
}
