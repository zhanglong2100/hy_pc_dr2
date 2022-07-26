import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn} from '@delon/abc';
import {PublicNoticeDownloadSearchForm} from '../entity/public-notice-download-search-form';
import {PublicNoticeDownload} from '../entity/public-notice-download';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGridComponent, BaseService} from '@sb/base';
import {PublicNoticeDownloadService} from '../public-notice-download.service';
import { DatePipe } from '@angular/common';
import {PublicNoticeDownloadRoutingModule} from '../public-notice-download-routing.module';
import {NzMessageService, UploadChangeParam, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {environment} from '../../../../environments/environment';
import {OuUser} from '../../../system/ou/ou-user/entity/ou-user';
import {SFSchema} from '@delon/form';


@Component({
    selector: 'public-notice-download',
    templateUrl: './public-notice-download.component.html',
    styleUrls: ['./public-notice-download.component.less'],
    // providers: [DatePipe, PublicNoticeService]
    providers: [
        [DatePipe],
        [{
        provide: BaseService,
        useClass: PublicNoticeDownloadService
        }]
    ]
})
export class PublicNoticeDownloadComponent implements OnInit {

    dateFormat = 'yyyy-MM-dd';
    // 搜索form
    searchForm: PublicNoticeDownloadSearchForm = {} as PublicNoticeDownloadSearchForm;


    uploadUrl = `${this.publicNoticeDownloadService.uploadUrl}`;

    dateRange = [];
    dateRange2 = [];
    nzFileList: UploadFile[] = [];

    // 表格结构
    columns: STColumn[] = [
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

    showDetail = false;
    showDetailUpdate = false;
    record: PublicNoticeDownload;
    detailPanelType = 'add';

    // 表格组件
    @ViewChild(BaseGridComponent, {static: true})
    bg: BaseGridComponent;

    _selected: PublicNoticeDownload;

    get selectedModule() {
        return this._selected;
    }

    @Input()
    set selectedModule(_selected: PublicNoticeDownload) {
        if (_selected ) {
            this._selected = _selected;
        } else {
            this._selected = null;
        }
    }

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private datePipe: DatePipe,
        private message: NzMessageService,
        public publicNoticeDownloadService: PublicNoticeDownloadService
    ) {
    }

    ngOnInit() {
        // this.updateSchema(null);
    }


/*    updateSchema(value: PublicNoticeDownload) {
        this.schema = {
            properties: {
                createTime: {
                    type: 'string',
                    title: '失效日期',
                    format: 'date-time',
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                }
            },
            required: ['endDate']

        } as SFSchema ;
    }*/


    /**
     * 点击新增 或 修改
     *  data
     */
    customDetailClick(data) {
        this.detailPanelType = data.detailPanelType;
        this.showDetail = true;
        // if ( type === 'add') {
        //     this.showDetail = true;
        // }
        // if ( type === 'modify') {
        //     this.showDetailUpdate = true;
        // }

        this.record = data.record;
    }

    /**
     * 关闭新增窗口时触发的事件
     */
    // eventClose(empt) {
    //     if (empt) {
    //         this.bg.reload();
    //     }
    //     // this.showDetail = !this.showDetail;
    //     this.showDetail = false;
    //     this.showDetailUpdate = false;
    // }

    /**
     * 查询
     */
    doSearch() {
        this.bg.reload();
    }

    reset() {
        delete this.searchForm.createTimeStart;
        delete this.searchForm.createTimeEnd;
        delete this.searchForm.name;

        this.dateRange = [];
        this.dateRange2 = [];

        this.bg.reload();
    }

    handleChange(info: UploadChangeParam): void {

        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            this.nzFileList = [];
            this.bg.reload();
        } else if (info.file.status === 'error') {
        }
    }

    before(item) {
        // if (this.baseParam.moduleId !== '-1') {
        //     return true;
        // } else {
        //     this.message.error('请选择一个有效结点后再进行上传！');
        //     return false;
        //
        // }

        // 隐藏掉上传文件的回显
        const  eles = document.getElementsByClassName('ant-upload-list-text');
        if (eles.length > 0 ) {
            eles[0].setAttribute('style', 'display: none;');
        }
        return true;
    }

    customRequst(item: UploadXHRArgs) {
        const formData = new FormData();
        formData.append('file', item.file as any);
        return this.publicNoticeDownloadService.upload(formData).subscribe(
            res => {
                if (res.success) {
                    this.bg.reload();
                    this.message.success('成功上传!');
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
        // this.sysCodeService.importCode(item, this.selectedModule.id, this.activatedNode ? this.activatedNode.id : '-1')
    }

    /**
     * 点击
     *  data
     */
    // selectItem(data) {
    //   console.info(data);
    //
    // }

    download() {

        const checkData =  this.bg.checkData;
        if (checkData.length !== 1) {
            this.message.success('请选择其中一个!');
        } else {
            const url = `${this.publicNoticeDownloadService.downloadPath}?ids=` + checkData[0].id;
            window.open(url);
        }
        // for ( let i = 0 ; i < checkData.length; i++) {
        //       url = url + '&id=' + checkData[i].id ;
        // }

        // checkData.forEach((data, index, array) => {
        //     url = url + '&ids=' + data.id + ',';
        // });
    }


    /**
     *  选择创建日期
     * {Date} result
     */
    dateRangeOnChange2(result: Date) {
        this.searchForm.createTimeStart = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.searchForm.createTimeEnd = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
    }


    /**
     * 关闭新增窗口时触发的事件
     */
    eventClose(empt) {
        if (empt) {
            this.bg.reload();
            // this.updateSchema(value);
        }
    }


}
