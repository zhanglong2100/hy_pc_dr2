import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn} from '@delon/abc';
import {PublicNoticeSearchForm} from '../entity/public-notice-search-form';
import {PublicNotice} from '../entity/public-notice';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGridComponent, BaseService} from '@sb/base';
import {PublicNoticeService} from '../public-notice.service';
import { DatePipe } from '@angular/common';
import {STData} from '@delon/abc/table/table.interfaces';
// import zh from '@angular/common/locales/zh';
// import {registerLocaleData} from '@angular/common';
// registerLocaleData(zh);

@Component({
    selector: 'public-notice',
    templateUrl: './public-notice.component.html',
    styleUrls: ['./public-notice.component.less'],
    // providers: [DatePipe, PublicNoticeService]
    providers: [
        [DatePipe],
        [{
        provide: BaseService,
        useClass: PublicNoticeService
        }]
    ]
})
export class PublicNoticeComponent implements OnInit {

    dateFormat = 'yyyy-MM-dd';
    // 搜索form
    searchForm: PublicNoticeSearchForm = {} as PublicNoticeSearchForm;

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
            // width: '4%',
            width: '80px',
            dateFormat: 'YYY-MM-DD',
            format: (item, col, index) => {
                    if (item.createTime !=  null) {
                        return item.createTime.split(' ')[0];
                    }
                    return item.createTime;
                }
        }, {
            title: '发布时间',
            index: 'publicTime',
            // width: '4%',
            width: '80px',
            dateFormat: 'YYY-MM-DD',
            format: (item, col, index) => {
                if (item.publicTime !=  null) {
                    return item.publicTime.split(' ')[0];
                }
                return item.publicTime;
            }
        }, {
            title: '发布网站',
            index: 'publicWeb',
            // width: '5%',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '省份',
            index: 'province',
            // width: '3%',
            width: '80px',
            className: 'text-center word-break'
        }, {
            title: '项目名称',
            index: 'projectName',
            // width: '9%',
            width: '200px',
            fixed: 'left',
            className: 'text-center word-break'
            // format: (item, col, index) => {
            //     if (item.projectName.length > 30) {
            //         return item.projectName.substr(0, 30) + '...';
            //     }
            //     return item.projectName;
            // }
        },  {
            title: '公告类型',
            index: 'publicNoticeType',
            // width: '3%',
            width: '90px',
            className: 'text-center word-break'
        },  {
            title: '采购类型',
            index: 'purchaseType',
            // width: '3%',
            width: '90px',
            className: 'text-center word-break'
        }, {
            title: '业务类型',
            index: 'businessType',
            // width: '4%',
            width: '100px',
            className: 'text-center word-break'
        }, {
            title: '预算金额',
            index: 'budget',
            // width: '5%',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '得分情况',
            index: 'score',
            // width: '5%',
            width: '120px',
            className: 'text-center word-break'
        }, {
            title: '获取招标时间',
            index: 'biddingTime',
            // width: '15%',
            width: '400px',
            className: 'text-center word-break'
        }, {
            title: '提交投标文件截止时间',
            index: 'endTime',
            // width: '15%',
            width: '460px',
            className: 'text-center word-break'
        }, {
            title: '采购人信息名称',
            index: 'purchaseUser',
            // width: '5%',
            width: '200px',
            className: 'text-center word-break'
        }, {
            title: '采购代理机构信息名称',
            index: 'purchaseOrganization',
            // width: '10%',
            width: '250px',
            className: 'word-break'
        }, {
            title: '中标单位',
            index: 'winningUnit',
            // width: '5%',
            width: '360px',
            className: 'text-center word-break'
        }, {
            title: '中标金额',
            index: 'bidPrice',
            // width: '5%'
            width: '360px',
            className: 'text-center word-break'
        }, {
            title: '评审专家',
            index: 'reviewExperts',
            // width: '5%',
            width: '140px',
            className: 'text-center word-break'
        }
    ];

    showDetail = false;
    showDetailUpdate = false;
    record: PublicNotice;
    detailPanelType = 'add';

    // 表格组件
    @ViewChild(BaseGridComponent, {static: true})
    bg: BaseGridComponent;

    _selected: PublicNotice;

    get selectedModule() {
        return this._selected;
    }

    @Input()
    set selectedModule(_selected: PublicNotice) {
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
        public publicNoticeService: PublicNoticeService
    ) {
    }

    ngOnInit() {
    }

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
    eventClose(empt) {
        if (empt) {
            this.bg.reload();
        }
        // this.showDetail = !this.showDetail;
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
        delete this.searchForm.publicWeb;
        delete this.searchForm.province;
        delete this.searchForm.businessType;
        delete this.searchForm.publicNoticeType;
        delete this.searchForm.purchaseType;
        delete this.searchForm.bidIf;
        delete this.searchForm.score;

        // this.projectNameValue = this.publicWebValue = this.provinceValue  = '';
        // this.businessTypeValue = this.purchaseTypeValue =  '';
        this.dateRange = [];
        this.dateRange2 = [];

        this.bg.reload();
    }

    /*
     *  导出
     */
    exports() {
        let url = `${this.publicNoticeService.exportPath}?id=`;

        if (this.searchForm.projectName) {
            url = url +  '&projectName=' + this.searchForm.projectName;
        }
        if (this.searchForm.publicWeb) {
            url = url +  '&publicWeb=' + this.searchForm.publicWeb;
        }
        if (this.searchForm.province) {
            url = url +  '&province=' + this.searchForm.province;
        }

        if (this.searchForm.businessType) {
            url = url +  '&businessType=' + this.searchForm.businessType;
        }

        if (this.searchForm.publicNoticeType) {
            url = url +  '&publicNoticeType=' + this.searchForm.publicNoticeType;
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
        if (this.searchForm.purchaseType ) {
            url = url +  '&purchaseType=' + this.searchForm.purchaseType;
        }
        if (this.searchForm.bidIf ) {
            url = url +  '&bidIf=' + this.searchForm.bidIf;
        }
        if (this.searchForm.score ) {
            url = url +  '&score=' + this.searchForm.score;
        }

        // if (this.dateRange != null && this.dateRange.length === 2) {
        //     this.searchForm.publicTimeStart = this.dateRange[0];
        //     this.searchForm.publicTimeEnd = this.dateRange[1];
        // }
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


}
