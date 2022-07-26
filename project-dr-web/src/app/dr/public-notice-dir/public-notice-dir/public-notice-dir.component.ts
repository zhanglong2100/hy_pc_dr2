import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseNzTreeNodeOptions, BaseService, BaseTreeComponent} from '@sb/base';
import {SFSchema, SFTextareaWidgetSchema} from '@delon/form';
import {NzMessageService, NzModalService, UploadChangeParam, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {PublicNoticeDirSearchForm} from '../entity/public-notice-dir-search-form';
import {STColumn} from '@delon/abc';
import {PublicNoticeDir} from '../entity/public-notice-dir';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {PublicNoticeDirTreeService} from '../service/public-notice-dir-tree.service';
import {PublicNoticeDirTreeNode} from '../entity/public-notice-dir-tree-node';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {DatePipe} from '@angular/common';
import {any} from 'codelyzer/util/function';


@Component({
    selector: 'public-notice-dir',
    templateUrl: './public-notice-dir.component.html',
    styleUrls: ['./public-notice-dir.component.less'],
    providers: [
        [DatePipe],
        [{
            provide: BaseTreeService,
            useClass: PublicNoticeDirTreeService
        },
        {
            provide: BaseService,
            useClass: PublicNoticeDirTreeService
        }]
    ]
})
export class PublicNoticeDirComponent implements OnInit {

    showRightOnePanel =  true ;
    showRightTwoPanel =  false ;

    typeIcon = {
        // APPLICATION: 'dr:hy-application',
        // MENU: 'dr:hy-menu',
        // MODULE: 'dr:hy-module'
        DIR: 'dr:hy-application',
        FOLDER: 'dr:hy-module',
        FILE: 'dr:hy-application'
    };

    searchForm: PublicNoticeDirSearchForm = {
        parentId: '-1'
    };

    @ViewChild(BaseGridComponent, {static: false})
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
            title: '类型',
            index: 'type',
            format: v => {
                if (v.type === 'DIR') {
                    return '目录';
                } else if (v.type === 'FOLDER') {
                    return '文件夹';
                }  else {
                    return '文件';
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
                        value: 'DIR',
                        label: '目录'
                    },
                    {
                        value: 'FOLDER',
                        label: '文件夹'
                    }
                ]
            },
            code: {
                type: 'string',
                title: '编码'
            }
        },
        required: ['name', 'type']
    } as SFSchema;


    // 文件表格结构
    columnsFile: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'id'
        }, {
            title: '上传日期',
            index: 'createTime',
            // width: '4%',
            width: '40%',
            className: 'text-center word-break',
            dateFormat: 'YYY-MM-DD',
            format: (item, col, index) => {
                if (item.createTime !=  null) {
                    return item.createTime.split(' ')[0];
                }
                return item.createTime;
            }
        },  {
            title: '名称',
            index: 'name',
            // width: '9%',
            width: '50%',
            fixed: 'left',
            className: 'text-center word-break'
        }
    ];

    constructor(
        private message: NzMessageService,
        private menuService: PublicNoticeDirTreeService,
        private datePipe: DatePipe,
        private modal: NzModalService) {
    }

    /*  文件    */
    uploadUrl = `${this.menuService.uploadUrl}`;
    nzFileList: UploadFile[] = [];
    dateRange = [];
    dateFormat = 'yyyy-MM-dd';

    ngOnInit(): void {
    }

    /*  文件    */
    handleChange(info: UploadChangeParam): void {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            this.nzFileList = [];
            this.baseGrid.reload();
        } else if (info.file.status === 'error') {
        }
    }

    /**
     * 上传
     */
    customRequst(item: UploadXHRArgs) {
        const formData = new FormData();
        formData.append('file', item.file as any);
        formData.append('parentId', this.searchForm.parentId);
        return this.menuService.upload(formData).subscribe(
            res => {
                if (res.success) {
                    this.baseGrid.reload();
                    this.message.success('成功上传!');
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }

    /**
     * 在点击上传文件后
     */
    before(item) {
        // 隐藏掉上传文件的回显
        const  eles = document.getElementsByClassName('ant-upload-list-text');
        if (eles.length > 0 ) {
            for (let i = 0; i < eles.length ; i++) {
                eles[i].setAttribute('style', 'display: none;');
            }
        }
        return true;
    }

    /**
     * 下载文件
     */
    download() {
        const checkData =  this.baseGrid.checkData;
        if (checkData.length !== 1) {
            this.message.success('请选择其中一个!');
        } else {
            const url = `${this.menuService.downloadPath}?ids=` + checkData[0].id;
            window.open(url);
        }
    }

    /**
     * 下载文件夹
     */
    downloadFolder() {
        const url = `${this.menuService.downloadPath}?ids=` + this.searchForm.parentId;
        window.open(url);
    }

    /**
     *  选择创建日期
     * {Date} result
     */
    dateRangeOnChange(result: Date) {
        this.searchForm.createTimeStart = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.searchForm.createTimeEnd = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
    }

    /**
     * 重置
     */
    reset() {
        delete this.searchForm.createTimeStart;
        delete this.searchForm.createTimeEnd;
        delete this.searchForm.name;
        this.dateRange = [];

        this.baseGrid.reload();
    }

    /**
     * 查询
     */
    doSearch() {
        this.baseGrid.reload();
    }


    /*  目录   文件夹    */
    selectNode(node: BaseNzTreeNodeOptions<PublicNoticeDirTreeNode>): void {
        console.info('selectNode');
        this.baseTree.activatedNode = node;

        // 根据类型 判断右侧面板显示
        if (this.baseTree.activatedNode.type === 'DIR') {
            // 目录
            this.showRightOnePanel = true;
            this.showRightTwoPanel = false;
        } else if (this.baseTree.activatedNode.type === 'FOLDER') {
            // 文件夹
            this.showRightOnePanel = false;
            this.showRightTwoPanel = true;

        } else if (this.baseTree.activatedNode.type === 'File') {
            // 文件
            this.showRightOnePanel = false;
            this.showRightTwoPanel = false;
        } else {
            this.showRightOnePanel = true;
            this.showRightTwoPanel = false;
        }
        this.loadData();

    }

    updateSchema(): void {
        if (this.baseTree.activatedNode.type === 'root') {
            this.schema.properties.type.enum = [{
                value: 'DIR',
                label: '目录'
            }, {
                value: 'FOLDER',
                label: '文件夹'
            }];
            this.schema.properties.type.default = 'DIR';
        }
    }

    loadData(): void {
        const key = this.baseTree.activatedNode.key;
        if (this.baseTree.activatedNode.type === 'root' ||  this.baseTree.activatedNode.type === 'DIR' ||  this.baseTree.activatedNode.type === 'FOLDER' ) {
            this.searchForm.parentId = key;
            if (this.baseGrid.showType === 'table' && this.baseGrid.st) {
                this.baseGrid.st.clear();
                this.baseGrid.st.resetColumns({emitReload: false}).then();
            }
            this.baseGrid.reload(true);
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

    beforeDrop(dragNode: PublicNoticeDirTreeNode, targetNode: PublicNoticeDirTreeNode): boolean {
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
            this.schema.properties.name.readOnly = false;
            this.schema.properties.type.enum = [
                {
                    value: 'DIR',
                    label: '目录'
                }, {
                    value: 'FOLDER',
                    label: '文件夹'
                }
            ];
            this.schema.properties.type.default = 'DIR';
        } else {
            this.schema.properties.name.readOnly = true;
            this.schema.properties.type.readOnly = true;
            this.schema.properties.type.enum = [
                {
                    value: 'DIR',
                    label: '目录'
                }, {
                    value: 'FOLDER',
                    label: '文件夹'
                }, {
                    value: 'FILE',
                    label: '文件'
                }
            ];
            this.schema.properties.type.default = 'DIR';
        }
    }

    onDataReload() {
        const data = this.baseTree.activatedNode.data;
        const parentId = data ? data.parentId ? data.parentId : '-1' : '-1';
        this.baseTree.reloadNode(parentId);
    }

    recordWrapper(rmMenu: PublicNoticeDir): PublicNoticeDir {
        if (this.baseTree.activatedNode.key !== rmMenu.id) {
            Object.assign(rmMenu, {parentId: this.baseTree.activatedNode.key});
        }
        // delete rmMenu.iconData;
        return rmMenu;
    }

    beforeRemove(menus: PublicNoticeDir[]): Observable<boolean> {
        const subject = new BehaviorSubject(false);
        for (let i = 0; i < menus.length; i++) {
            const menu = menus[i];
            if (menu.type === 'DIR') {
                this.modal.confirm({
                    nzTitle: '删除提示',
                    nzContent: '删除目录会同时删除当前节点下的所有目录及文件，是否确定删除?',
                    nzOnOk: () => {
                        subject.next(true);
                        subject.complete();
                    }
                }, 'warning');
                break;
            }
            if (menu.type === 'FOLDER') {
                this.modal.confirm({
                    nzTitle: '删除提示',
                    nzContent: '删除文件夹会同时删除当前节点下的文件，是否确定删除?',
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
