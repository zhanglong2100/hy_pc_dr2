import {Component, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {SysCodeCategory, SysCodeCategoryType} from '../entity/sys-code-category';
import {SysCodeCategoryService} from '../service/sys-code-category.service';
import {BaseService, BaseTreeComponent} from '@sb/base';
import {SFSchema} from '@delon/form';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {SysCodeCategoryTreeNode} from '../entity/sys-code-category-tree-node';

@Component({
    selector: 'sys-code-category',
    templateUrl: './sys-code-category.component.html',
    styleUrls: ['./sys-code-category.component.less'],
    providers: [{
        provide: BaseTreeService,
        useClass: SysCodeCategoryService
    }, {
        provide: BaseService,
        useClass: SysCodeCategoryService
    }]
})
export class SysCodeCategoryComponent implements OnInit {

    @ViewChild('baseTree', {static: false})
    baseTree: BaseTreeComponent;

    activatedCategory: SysCodeCategory;

    showAddModule = true;
    showAddCode = true;
    showRefresh = true;

    _showDetailPanel = false;

    selectNode(selectedNodeTreeNode: SysCodeCategoryTreeNode): void {
        if (selectedNodeTreeNode.key === '-1') {
            selectedNodeTreeNode.data = {id: '-1'};
        }
        this.activatedCategory = selectedNodeTreeNode.data;
        this.showAddCode = this.activatedCategory.type !== 'leaf';
        this.showAddModule = this.activatedCategory.type !== 'leaf';
    }

    constructor(
        private message: NzMessageService,
        private sysCodeModuleService: SysCodeCategoryService) {
    }

    schema: SFSchema;

    get baseParam() {
        if (this.activatedCategory) {
            return {
                parentId: this.activatedCategory.id
            } as SysCodeCategory;
        } else {
            return {
                parentId: '-1'
            } as SysCodeCategory;
        }
    }

    detailPanelType = 'add';

    detailRecord: SysCodeCategory;

    ngOnInit(): void {
    }

    beforeDrop(dragNode: SysCodeCategoryTreeNode, targetNode: SysCodeCategoryTreeNode) {
        // const dragNodeType: SysCodeCategoryType = (dragNode.data as SysCodeCategory).type;
        const targetNodeType: SysCodeCategoryType = (targetNode.data as SysCodeCategory).type;
        return targetNodeType === 'module' || targetNodeType === 'root';
    }

    addModule() {
        this.detailRecord = {
            type: 'module',
            parentId: this.activatedCategory ? this.activatedCategory.id : '-1',
        } as SysCodeCategory;
        this.detailPanelType = 'add';
        this._showDetailPanel = true;
        this.updateSchema();
    }

    addCode() {
        this.detailRecord = {
            type: 'leaf',
            parentId: this.activatedCategory ? this.activatedCategory.id : '-1'
        } as SysCodeCategory;

        this.detailPanelType = 'add';
        this._showDetailPanel = true;

        this.updateSchema();
    }

    reload() {
        this.baseTree.reload();
    }

    detailClose(empt) {
        if (empt) {
            this.baseTree.reloadNode(this.detailRecord.parentId);
        }
        this._showDetailPanel = false;
    }

    modifyClick(event: Event, treeNode: SysCodeCategoryTreeNode) {
        this.detailRecord = treeNode.data;

        this.updateSchema();
        this._showDetailPanel = true;
        this.detailPanelType = 'modify';

        event.preventDefault();
    }

    deleteClick(treeNode: SysCodeCategoryTreeNode) {
        this.sysCodeModuleService
            .remove([treeNode.data.id])
            .subscribe(returnForm => {
                if (returnForm.success) {
                    this.baseTree.reloadNode(treeNode.data.parentId);
                    this.message.info('删除成功！');
                } else {
                    this.message.error(returnForm.errorMessage);
                }
            });
    }

    updateSchema() {
        this.schema = {
            properties: {
                type: {
                    type: 'string',
                    title: '节点类型',
                    readOnly: this.detailRecord && !!this.detailRecord.id,
                    enum: [{label: '模块', value: 'module'}, {label: '字典', value: 'leaf'}],
                },
                parentName: {
                    type: 'string',
                    title: '父节点名称',
                    readOnly: true
                },
                name: {
                    type: 'string',
                    title: '节点名称'
                },
                code: {
                    type: 'string',
                    title: '节点编码',
                    ui: {
                        visibleIf: {
                            type: ['leaf']
                        }
                    }
                },
                active: {
                    type: 'boolean',
                    title: '启用',
                    default: true
                }
            },
            required: ['name', 'code'],
            ui: {
                grid: {
                    span: 23
                }
            }
        } as SFSchema;
    }
}
