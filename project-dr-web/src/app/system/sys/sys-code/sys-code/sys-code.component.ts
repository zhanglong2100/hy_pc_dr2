import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseService, BaseTreeComponent} from '@sb/base';
import {SysCodeService} from '../service/sys-code.service';
import {SFSchema} from '@delon/form';
import {NzMessageService, UploadChangeParam, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {SysCode} from '../entity/sys-code';
import {SysCodeCategory} from '../entity/sys-code-category';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {SysCodeTreeNode} from '../entity/sys-code-tree-node';
import {Observable} from 'rxjs';
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'sys-code',
    templateUrl: './sys-code.component.html',
    styleUrls: ['./sys-code.component.less'],
    providers: [
        {
            provide: BaseTreeService,
            useClass: SysCodeService
        },
        {
            provide: BaseService,
            useClass: SysCodeService
        }
    ]
})
export class SysCodeComponent implements OnInit {
    basePath = environment.baseServerUrl + "sys/code/";
    uploadUrl = this.basePath + "importCode";

    @ViewChild('baseTree', {static: false})
    baseTree: BaseTreeComponent;

    _selectedCategory: SysCodeCategory;

    get selectedModule() {
        return this._selectedCategory;
    }

    @Input()
    set selectedModule(_selectedCategory: SysCodeCategory) {

        if (_selectedCategory && _selectedCategory.type === 'leaf') {
            this._selectedCategory = _selectedCategory;
        } else {
            this._selectedCategory = null;
        }

        this.baseParam = {
            moduleId: this._selectedCategory ? this._selectedCategory.id : '-1'
        } as SysCode;

        if (this.baseTree) {
            this.baseTree.searchConfig = this.baseParam;

            this.reload();
        }
    }

    activatedNode: SysCode;

    showAddItem = true;
    showRefresh = true;

    _showDetailPanel = false;

    schema: SFSchema;


    baseParam = {
        moduleId: '-1',
    } as SysCode;

    detailPanelType = 'add';

    detailRecord: SysCode;

    nzFileList: UploadFile[] = [];

    constructor(
        private message: NzMessageService,
        public sysCodeService: SysCodeService) {
    }

    uploadParam = (file: UploadFile): object | Observable<object> => {
        return {
            moduleId: this.selectedModule.id,
            codeId: this.activatedNode ? this.activatedNode.id : '-1'
        };
    }


    customRequst(item: UploadXHRArgs) {
        const formData = new FormData();
        formData.append('file', item.file as any);
        formData.append('moduleId', this.selectedModule.id);
        formData.append('codeId', this.activatedNode ? this.activatedNode.id : '-1');
        return this.sysCodeService.importCode(formData).subscribe(
            res => {
                if (res.success) {
                    this.message.success('成功上传!');
                }
            }
        )
        // this.sysCodeService.importCode(item, this.selectedModule.id, this.activatedNode ? this.activatedNode.id : '-1')
    }

    before(item) {
        if (this.baseParam.moduleId != "-1") {
            return true;
        } else {
            this.message.error('请选择一个有效结点后再进行上传！');
            return false;

        }
    }

    selectNode(selectedNode: SysCodeTreeNode): void {
        if (selectedNode.key === '-1') {
            selectedNode.data.id = '-1';
        }
        this.activatedNode = selectedNode.data;
    }

    ngOnInit(): void {
    }

    addItem() {
        this.detailRecord = {
            parentId: this.activatedNode ? this.activatedNode.id : '-1'
        } as SysCode;

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

    modifyClick(event: Event, treeNode: SysCodeTreeNode) {
        this.detailRecord = treeNode.data;

        this.updateSchema();
        this._showDetailPanel = true;
        this.detailPanelType = 'modify';
        event.preventDefault();
    }

    deleteClick(treeNode: SysCodeTreeNode) {
        this.sysCodeService
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
                name: {
                    type: 'string',
                    title: '名称'
                },
                code: {
                    type: 'string',
                    title: '编码',
                },
                active: {
                    type: 'boolean',
                    title: '启用',
                    default: true
                }
            },
            required: ['name', 'code'],
            ui: {
                spanLabelFixed: 100,
                grid: {
                    span: 22
                }
            }
        } as SFSchema;
    }

    handleChange(info: UploadChangeParam): void {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            this.nzFileList = [];
            this.reload();
        } else if (info.file.status === 'error') {
        }
    }

    doDownload() {
        window.open(`${this.sysCodeService.downloadUrl}?moduleCode=${this.selectedModule.code}`);
    }
}
