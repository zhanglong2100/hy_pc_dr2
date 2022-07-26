import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn, STColumnButton, STData} from '@delon/abc';
import {AgencySupermarketSearchForm} from '../entity/agency-supermarket-search-form';
import {AgencySupermarket} from '../entity/agency-supermarket';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGridComponent, BaseService, Page, ReturnForm} from '@sb/base';
import {AgencySupermarketService} from '../agency-supermarket.service';
import { DatePipe } from '@angular/common';
import {SysCodeService} from '../../../system/sys/sys-code/service/sys-code.service';
import {NzMessageService, UploadChangeParam, UploadFile, UploadXHRArgs} from 'ng-zorro-antd';
import {Observable} from 'rxjs';


@Component({
    selector: 'agency-supermarket',
    templateUrl: './agency-supermarket.component.html',
    styleUrls: ['./agency-supermarket.component.less'],
    providers: [
        [DatePipe],
        [{
        provide: BaseService,
        useClass: AgencySupermarketService
        }]
    ]
})
export class AgencySupermarketComponent implements OnInit {

    businessTypeCodes: any = [];
    dateFormat = 'yyyy-MM-dd';
    // 搜索form
    searchForm: AgencySupermarketSearchForm = {} as AgencySupermarketSearchForm;

    uploadUrl = `${this.agencySupermarketService.uploadUrl}`;
    nzFileList: UploadFile[] = [];
    dateRange = [];
    dateRange2 = [];
    // projectNameValue = '';
    // publicWebValue = '';
    // businessTypeValue = '';
    // purchaseTypeValue = '';
    // provinceValue = '';

    // 表格结构
    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'id'
        }, {
            title: '创建日期',
            index: 'createTime',
            width: '80px',
            dateFormat: 'YYY-MM-DD',
            format: (item, col, index) => {
                    if (item.createTime !=  null) {
                        return item.createTime.split(' ')[0];
                    }
                    return item.createTime;
                }
        }, {
            title: '月份',
            index: 'month',
            width: '50px',
            className: 'text-center word-break'
        }, {
            title: '序号',
            index: 'orderNum',
            width: '50px',
            className: 'text-center word-break'
        },   {
            title: '地区',
            index: 'area',
            width: '50px',
            className: 'text-center word-break'
        },   {
            title: '项目名称',
            index: 'projectName',
            width: '320px',
            className: 'text-center word-break'
        },  {
            title: '业主单位',
            index: 'ownerUnit',
            width: '200px',
            className: 'text-center word-break'
        },  {
            title: '业务类型',
            index: 'businessType',
            width: '100px',
            className: 'text-center word-break'
        }, {
            title: '中介超市',
            index: 'agencySupermarket',
            width: '130px',
            className: 'text-center word-break'
        },  {
            title: '金额',
            index: 'budget',
            width: '240px',
            className: 'text-center word-break'
        },  {
            title: '链接',
            index: 'publicNoticeUrl',
            width: '50px',
            className: 'text-center word-break',
            format: (item, col, index) => {
                return '';
            },
            buttons: [
                {
                    text: (record: AgencySupermarket, btn: STColumnButton) => {
                        if (record.publicNoticeUrl === '') {return ''; }
                        return `<a class='text-error'>链接</a>`;
                    },
                    type: 'none',
                    click: (record: AgencySupermarket) => {
                        window.open(record.publicNoticeUrl);
                    }
                }
            ]
        }, {
            title: '发布时间',
            index: 'publicTime',
            width: '150px',
            className: 'text-center word-break',
            // dateFormat: 'YYY-MM-DD',
            format: (item, col, index) => {
                if (item.publicTime !=  null) {
                    // return item.publicTime.split(' ')[0];
                }
                return item.publicTime;
            }
        }, {
            title: '报名截止时间',
            index: 'endTime',
            width: '170px',
            className: 'text-center word-break'
        }, {
            title: '选取方式',
            index: 'chooseType',
            width: '150px',
            className: 'text-center word-break'
        }, {
            title: '是否报名',
            index: 'ifApply',
            width: '80px',
            fixed: 'left',
            className: 'text-center word-break',
            format: (item, col, index) => {
                if (item.ifApply === '1') {
                    return  '是';
                }
                return '否';
            }
        },  {
            title: '是否中标',
            index: 'ifBidding',
            width: '80px',
            className: 'text-center word-break',
            format: (item, col, index) => {
                if (item.ifBidding === '1') {
                    return  '是';
                }
                return '否';
            }
        },  {
            title: '市场人员',
            index: 'marketPerson',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '录入人员',
            index: 'enteringPerson',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '是否归档',
            index: 'ifArchive',
            width: '80px',
            className: 'text-center word-break',
            format: (item, col, index) => {
                if (item.ifArchive === '1') {
                    return  '是';
                }
                return '否';
            }
        }, {
            title: '是否立项',
            index: 'ifProjectApproval',
            width: '80px',
            className: 'text-center word-break',
            format: (item, col, index) => {
                if (item.ifProjectApproval === '1') {
                    return  '是';
                }
                return '否';
            }
        },  {
            title: '立项编号',
            index: 'projectApprovalCode',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '备注',
            index: 'remark',
            width: '200px',
            className: 'text-center word-break'
        }
    ];

    showDetail = false;
    showDetailUpdate = false;
    record: AgencySupermarket;
    detailPanelType = 'add';

    // 表格组件
    @ViewChild(BaseGridComponent, {static: true})
    bg: BaseGridComponent;

    _selected: AgencySupermarket;

    get selectedModule() {
        return this._selected;
    }

    @Input()
    set selectedModule(_selected: AgencySupermarket) {
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
        private sysCodeService: SysCodeService,
        private message: NzMessageService,
        public agencySupermarketService: AgencySupermarketService
    ) {
    }

    ngOnInit() {

        // this.sysCodeService.getComboBox('PROJECT_TYPE').subscribe(returnForm => {
        //     if (returnForm.success) {
        //         const temp = [{name: '全部', code: ''}];
        //         this.businessTypeCodes = temp.concat(returnForm.message);
        //     } else {
        //         this.message.error('获取数据字典失败：' + returnForm.errorMessage);
        //     }
        // });
    }

    /**
     * 点击新增 或 修改
     *  data
     */
    customDetailClick(data) {
        this.detailPanelType = data.detailPanelType;
        this.showDetail = true;
        this.record = data.record;
    }

    /**
     * 关闭新增窗口时触发的事件
     */
    eventClose(empt) {
        if (empt) {
            this.bg.reload();
        }
        this.showDetail = false;
        this.showDetailUpdate = false;
    }

    /**
     * 查询
     */
    doSearch() {
        this.bg.reload();
    }

    reset() {
        delete this.searchForm.publicTimeStart;
        delete this.searchForm.publicTimeEnd;
        delete this.searchForm.createTimeStart;
        delete this.searchForm.createTimeEnd;
        delete this.searchForm.projectName;
        delete this.searchForm.projectApprovalCode;
        delete this.searchForm.agencySupermarket;
        delete this.searchForm.businessType;
        delete this.searchForm.ifArchive;
        delete this.searchForm.ifApply;
        delete this.searchForm.ifProjectApproval;
        delete this.searchForm.ifBidding;
        delete this.searchForm.chooseType;
        this.dateRange = [];
        this.dateRange2 = [];

        this.bg.reload();
    }

    /*
     *  导出
     */
    exports() {
        let url = `${this.agencySupermarketService.exportPath}?id=`;

        if (this.searchForm.projectName) {
            url = url +  '&projectName=' + this.searchForm.projectName;
        }
        if (this.searchForm.projectApprovalCode) {
            url = url +  '&projectApprovalCode=' + this.searchForm.projectApprovalCode;
        }
        if (this.searchForm.agencySupermarket) {
            url = url +  '&agencySupermarket=' + this.searchForm.agencySupermarket;
        }

        if (this.searchForm.chooseType) {
            url = url +  '&chooseType=' + this.searchForm.chooseType;
        }

        if (this.searchForm.businessType) {
            url = url +  '&businessType=' + this.searchForm.businessType;
        }

        if (this.searchForm.ifArchive) {
            url = url +  '&ifArchive=' + this.searchForm.ifArchive;
        }

        if (this.searchForm.ifApply ) {
            url = url +  '&ifApply=' + this.searchForm.ifApply;
        }
        if (this.searchForm.ifProjectApproval ) {
            url = url +  '&ifProjectApproval=' + this.searchForm.ifProjectApproval;
        }
        if (this.searchForm.ifBidding ) {
            url = url +  '&ifBidding=' + this.searchForm.ifBidding;
        }

        if (this.searchForm.publicTimeStart ) {
            url = url +  '&publicTimeStart=' + this.searchForm.publicTimeStart;
        }
        if (this.searchForm.publicTimeEnd ) {
            url = url +  '&publicTimeEnd=' + this.searchForm.publicTimeEnd;
        }
        if (this.searchForm.createTimeStart ) {
            url = url +  '&createTimeStart=' + this.searchForm.createTimeStart;
        }
        if (this.searchForm.createTimeEnd ) {
            url = url +  '&createTimeEnd=' + this.searchForm.createTimeEnd;
        }
        window.open(url);
    }

    /**
     *  选择发布时间
     * {Date} result
     */
    dateRangeOnChange(result: Date) {
        this.searchForm.publicTimeStart = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.searchForm.publicTimeEnd = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
    }

    /**
     *  选择创建日期
     * {Date} result
     */
    dateRangeOnChange2(result: Date) {
        this.searchForm.createTimeStart = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.searchForm.createTimeEnd = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
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

    customRequst(item: UploadXHRArgs) {
        const messageId = this.message.loading('正在上传文件...', {nzDuration: 0}).messageId;
        const formData = new FormData();
        formData.append('file', item.file as any);
        return this.agencySupermarketService.upload(formData).subscribe(
            res => {
                this.message.remove(messageId);
                if (res.success) {
                    this.bg.reload();
                    this.message.success('成功上传!');
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }

    before(item) {
        // 隐藏掉上传文件的回显
        const  eles = document.getElementsByClassName('ant-upload-list-text');
        if (eles.length > 0 ) {
            eles[0].setAttribute('style', 'display: none;');
        }
        return true;
    }

    sort() {
        const messageId = this.message.loading('正在排序中...', {nzDuration: 0}).messageId;
        this.agencySupermarketService.sort().subscribe(
            res => {
                this.message.remove(messageId);
                if (res.success) {
                    this.bg.reload();
                    this.message.success(res.message);
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }


    // commitWrapper(agencySupermarket: AgencySupermarket) {
    //     console.info('21112222');
    //     debugger;
    //     if (agencySupermarket.publicTime) {
    //         agencySupermarket.publicTime = this.datePipe.transform(agencySupermarket.publicTime, 'yyyy-MM-dd HH:mm:ss');
    //     }
    //     return agencySupermarket;
    // }
    //
    // customCommitMethod(form: AgencySupermarket, baseService?: BaseService<STData, Page>): Observable<ReturnForm<any>> {
    //     console.info('21112222');
    //     debugger;
    //     if (form.publicTime) {
    //         form.publicTime = this.datePipe.transform(form.publicTime, 'yyyy-MM-dd HH:mm:ss');
    //     }
    //     return this.agencySupermarketService.commit(form);
    // }


}
