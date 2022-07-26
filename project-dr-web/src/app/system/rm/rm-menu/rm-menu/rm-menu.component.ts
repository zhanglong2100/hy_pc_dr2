import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseNzTreeNodeOptions, BaseService, BaseTreeComponent} from '@sb/base';
import {SFSchema, SFTextareaWidgetSchema} from '@delon/form';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {RmMenuSearchForm} from '../entity/rm-menu-search-form';
import {STColumn} from '@delon/abc';
import {RmMenu} from '../entity/rm-menu';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {RmMenuTreeService} from '../service/rm-menu-tree.service';
import {RmMenuTreeNode} from '../entity/rm-menu-tree-node';
import {BehaviorSubject, Observable, of} from "rxjs";


@Component({
    selector: 'rm-menu',
    templateUrl: './rm-menu.component.html',
    styleUrls: ['./rm-menu.component.less'],
    providers: [
        {
            provide: BaseTreeService,
            useClass: RmMenuTreeService
        },
        {
            provide: BaseService,
            useClass: RmMenuTreeService
        }
    ]
})
export class RmMenuComponent implements OnInit {

    typeIcon = {
        APPLICATION: 'dr:hy-application',
        MENU: 'dr:hy-menu',
        MODULE: 'dr:hy-module'
    };

    searchForm: RmMenuSearchForm = {
        parentId: '-1'
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
            className: 'text-center word-wrap'
        }, {
            title: '名称',
            index: 'name',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '编码',
            index: 'code',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '打开方式',
            index: 'openType',
            format: v => {
                if (!v) {
                    return '';
                }
                switch (v.openType) {
                    case 'IFRAME':
                        return '普通打开';
                    case 'OPEN':
                        return '新窗口打开';
                    default:
                        return '';
                }
            },
            iif: () => this.baseTree.activatedNode.type !== 'root',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '应用类型',
            index: 'applicationType',
            format: v => {
                if (v.applicationType === 'WEB') {
                    return 'web';
                } else if (v.type === 'APP') {
                    return 'app';
                } else {
                    return '';
                }
            },
            iif: () => this.baseTree.activatedNode.type === 'root',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '类型',
            index: 'type',
            format: v => {
                if (v.type === 'APPLICATION') {
                    return '应用';
                } else if (v.type === 'MENU') {
                    return '菜单';
                } else {
                    return '目录';
                }
            },
            width: '15%',
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
                        value: 'APPLICATION',
                        label: '应用'
                    }, {
                        value: 'MENU',
                        label: '菜单'
                    }, {
                        value: 'MODULE',
                        label: '目录'
                    }
                ],
                default: 'APPLICATION'
            },
            code: {
                type: 'string',
                title: '编码'
            },
            applicationType: {
                type: 'string',
                title: '应用类型',
                enum: [
                    {
                        value: 'WEB',
                        label: 'web'
                    },
                    {
                        value: 'APP',
                        label: 'app'
                    }
                ],
                default: 'WEB',
                ui: {
                    widget: 'select',
                    visibleIf: {
                        type: ['APPLICATION']
                    }
                }
            },
            openType: {
                type: 'string',
                title: '打开方式',
                enum: [
                    {
                        value: 'IFRAME',
                        label: '普通打开'
                    },
                    {
                        value: 'OPEN',
                        label: '新窗口打开'
                    }
                ],
                default: 'IFRAME',
                ui: {
                    widget: 'select',
                    visibleIf: {
                        type: ['MENU']
                    }
                }
            },
            functionId: {
                type: 'string',
                title: '功能',
                ui: {
                    widget: 'rm-function-tree-select-alain',
                    parentId: '-1',
                    maxLevel: -1,
                    visibleIf: {
                        type: ['MENU']
                    }
                }
            },
            iconId: {
                type: 'string',
                title: '菜单图标',
                ui: {
                    widget: 'rm-menu-icon-select-alain'
                }
            },
            active: {
                type: 'boolean',
                title: '是否启用',
                default: true,
                ui: {
                    checkedChildren: '启用',
                    unCheckedChildren: '停用',
                    visibleIf: {
                        type: ['MENU']
                    }
                }
            },
            remark: {
                type: 'string',
                title: '备注',
                ui: {
                    widget: 'textarea',
                    autosize: {
                        minRows: 2,
                        maxRows: 8
                    },
                    visibleIf: {
                        type: ['MENU']
                    }
                } as SFTextareaWidgetSchema
            }
        },
        required: ['name', 'type', 'functionId', 'openType', 'active', 'applicationType']
    } as SFSchema;

    constructor(
        private message: NzMessageService,
        private menuService: RmMenuTreeService,
        private modal: NzModalService) {
    }

    ngOnInit(): void {
    }

    selectNode(node: BaseNzTreeNodeOptions<RmMenuTreeNode>): void {
        this.baseTree.activatedNode = node;
        this.loadData();
    }

    updateSchema(): void {
        if (this.baseTree.activatedNode.type === 'root') {
            this.schema.properties.type.enum = [{
                value: 'APPLICATION',
                label: '应用'
            }];
            this.schema.properties.type.default = 'APPLICATION';
        } else if (this.baseTree.activatedNode.type === 'APPLICATION' ||
            this.baseTree.activatedNode.type === 'MODULE') {
            this.schema.properties.type.enum = [
                {
                    value: 'MODULE',
                    label: '目录'
                },
                {
                    value: 'MENU',
                    label: '菜单'
                }];
            this.schema.properties.type.default = 'MODULE';
        }
    }

    loadData(): void {
        const key = this.baseTree.activatedNode.key;
        if (this.baseTree.activatedNode.type === 'root' ||
            this.baseTree.activatedNode.type === 'APPLICATION' ||
            this.baseTree.activatedNode.type === 'MODULE') {
            this.searchForm.parentId = key;
            if (this.baseGrid.showType === 'table' && this.baseGrid.st) {
                this.baseGrid.st.clear();
                this.baseGrid.st.resetColumns({emitReload: false}).then();
            }
            this.baseGrid.reload(false);
        } else {
            this.menuService.get(key).subscribe(
                (v) => {
                    if (v.success) {
                        this.baseGrid.modifyClick(v.message);
                    }
                }
            );
        }
    }

    beforeDrop(dragNode: RmMenuTreeNode, targetNode: RmMenuTreeNode): boolean {
        const dragNodeOptions = dragNode.origin;
        const targetNodeOptions = targetNode.origin;
        if (dragNodeOptions.type === 'root') {
            return false;
        } else if (dragNodeOptions.type === 'APPLICATION') {
            if (targetNodeOptions.type !== 'root') {
                return false;
            }
        } else if (dragNodeOptions.type === 'MODULE' ||
            dragNodeOptions.type === 'MENU') {
            if (targetNodeOptions.type !== 'APPLICATION' &&
                targetNodeOptions.type !== 'MODULE') {
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
                    value: 'APPLICATION',
                    label: '应用'
                }, {
                    value: 'MENU',
                    label: '菜单'
                }, {
                    value: 'MODULE',
                    label: '目录'
                }
            ];
            this.schema.properties.type.default = 'APPLICATION';
        }
    }

    onDataReload() {
        let data = this.baseTree.activatedNode.data;
        let parentId = data ? data.parentId ? data.parentId : '-1' : '-1';
        this.baseTree.reloadNode(parentId);
    }

    recordWrapper(rmMenu: RmMenu): RmMenu {
        if (this.baseTree.activatedNode.key !== rmMenu.id) {
            Object.assign(rmMenu, {parentId: this.baseTree.activatedNode.key});
        }
        delete rmMenu.iconData;
        return rmMenu;
    }

    beforeRemove(menus: RmMenu[]): Observable<boolean> {
        const subject = new BehaviorSubject(false);
        for (let i = 0; i < menus.length; i++) {
            let menu = menus[i];
            if (menu.type === 'APPLICATION' || menu.type === 'MODULE') {
                this.modal.confirm({
                    nzTitle: '删除提示',
                    nzContent: '删除应用或目录会同时删除当前节点下的所有菜单，是否确定删除?',
                    nzOnOk: () => {
                        subject.next(true);
                        subject.complete();
                    }
                }, 'warning');
                break;
            }

            if (i === menus.length - 1) {
                return of(true);
            }
        }
        return subject;
    }
}
