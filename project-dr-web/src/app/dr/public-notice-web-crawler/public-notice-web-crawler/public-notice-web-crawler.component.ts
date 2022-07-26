import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn, STColumnButton} from '@delon/abc';
import {PublicNoticeWebCrawlerSearchForm} from '../entity/public-notice-web-crawler-search-form';
import {PublicNoticeWebCrawler} from '../entity/public-notice-web-crawler';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseGridComponent, BaseService} from '@sb/base';
import {PublicNoticeWebCrawlerService} from '../public-notice-web-crawler.service';
import { DatePipe } from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd';


@Component({
    selector: 'public-notice-web-crawler',
    templateUrl: './public-notice-web-crawler.component.html',
    styleUrls: ['./public-notice-web-crawler.component.less'],
    // providers: [DatePipe, PublicNoticeService]
    providers: [
        [DatePipe],
        [{
        provide: BaseService,
        useClass: PublicNoticeWebCrawlerService
        }]
    ]
})
export class PublicNoticeWebCrawlerComponent implements OnInit {

    customOperateButtons = [{
        text: '解析',
        icon: 'edit',
        type: 'none',
        click: (record: PublicNoticeWebCrawler, modal, comp) => {
            this.analysis(record);
        }
    } as STColumnButton];

    dateFormat = 'yyyy-MM-dd';
    // 搜索form
    searchForm: PublicNoticeWebCrawlerSearchForm = {} as PublicNoticeWebCrawlerSearchForm;

    dateRange = [];
    dateRange2 = [];

    // 表格结构
    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'id'
        }, {
            title: '发布网站',
            index: 'publicWeb',
            width: '10%',
            className: 'text-center word-break'
        }, {
            title: '发布时间',
            index: 'publicTime',
            width: '10%',
            dateFormat: 'YYYY-MM-DD HH:mm',
            className: 'text-center word-break'
            // format: (item, col, index) => {
            //     if (item.publicTime !=  null) {
            //         return item.publicTime.split(' ')[0];
            //     }
            //     return item.publicTime;
            // }
        }, {
            title: '省份',
            index: 'province',
            width: '5%',
            className: 'text-center word-break'
        }, {
            title: '项目名称',
            index: 'title',
            width: '20%',
            fixed: 'left',
            className: 'text-center word-break'
            // format: (item, col, index) => {
            //     if (item.projectName.length > 30) {
            //         return item.projectName.substr(0, 30) + '...';
            //     }
            //     return item.projectName;
            // }
        },  {
            title: '招标类型',
            index: 'bidType',
            width: '10%',
            className: 'text-center word-break'
        }, {
            title: '采购人',
            index: 'purchaseUser',
            width: '10%',
            className: 'text-center word-break'
        }, {
            title: '采购代理机构',
            index: 'purchaseOrganization',
            width: '10%',
            className: 'text-center word-break'
        }, {
            title: '是否已解析',
            index: 'ifAnalysis',
            width: '8%',
            format: (item, col, index) => {
                if (item.ifAnalysis === '0') {
                    return '否';
                }
                return '是';
            },
            className: 'text-center word-break'
        }, {
            title: '公告链接',
            index: 'publicNoticeUrl',
            width: '8%',
            className: 'text-center word-break',
            format: (item, col, index) => {
                return '';
            },
            buttons: [
                {
                    text: (record: PublicNoticeWebCrawler, btn: STColumnButton) => {
                        return `<a class='text-error'>招标链接</a>`;
                    },
                    type: 'none',
                    click: (record: PublicNoticeWebCrawler) => {
                        window.open(record.publicNoticeUrl);
                    }
                }
            ]
        }
    ];

    showDetail = false;
    showDetailUpdate = false;
    record: PublicNoticeWebCrawler;
    detailPanelType = 'add';
    // showDetailConfig = false;

    // 表格组件
    @ViewChild(BaseGridComponent, {static: true})
    bg: BaseGridComponent;

    _selected: PublicNoticeWebCrawler;

    get selectedModule() {
        return this._selected;
    }

    @Input()
    set selectedModule(_selected: PublicNoticeWebCrawler) {
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
        public publicNoticeWebCrawlerService: PublicNoticeWebCrawlerService
    ) {
    }


    ngOnInit() {
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
        // this.showDetailConfig = false;
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
        delete this.searchForm.title;
        delete this.searchForm.publicWeb;
        delete this.searchForm.province;
        delete this.searchForm.bidType;
        delete this.searchForm.ifAnalysis;

        this.dateRange = [];
        this.dateRange2 = [];

        this.bg.reload();
    }


    /**
     *  选择发布时间
     * {Date} result
     */
    dateRangeOnChange(result: Date) {
        this.searchForm.publicTimeStart = this.datePipe.transform(result[0], 'yyyy-MM-dd HH:mm:ss');
        this.searchForm.publicTimeEnd = this.datePipe.transform(result[1], 'yyyy-MM-dd HH:mm:ss');
    }


    analysis(record: PublicNoticeWebCrawler) {

        if ( record.ifAnalysis !== '0' ) {
            this.message.warning('已经解析过，请不要再解析!');
            return ;
        }

        console.info(record.publicTime);

        const formData = new FormData();
        formData.append('id', record.id);
        // formData.append('publicNoticeUrl', record.publicNoticeUrl);
        // formData.append('title', record.title);
        // formData.append('publicWeb', record.publicWeb);
        // formData.append('publicTime', record.publicTime);
        // formData.append('province', record.province);
        // formData.append('bidType', record.bidType);
        // formData.append('purchaseUser', record.purchaseUser);
        // formData.append('purchaseOrganization', record.purchaseOrganization);
        // formData.append('ifAnalysis', record.ifAnalysis);
        this.publicNoticeWebCrawlerService.analysis(formData).subscribe(res => {
          if (res.success) {
              this.bg.reload();
              this.message.success(res.message);
          } else {
              this.message.error(res.errorMessage);
          }
        });
    }


    // autoConfig() {
    //     showDetailConfig = true;
    // }


    stop() {
        const formData = new FormData();
        formData.append('flag', 'stop');
        return this.publicNoticeWebCrawlerService.stopOrStart(formData).subscribe(
            res => {
                if (res.success) {
                    // this.baseGrid.reload();
                    this.message.success(res.message);
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }

    start() {
        const formData = new FormData();
        formData.append('flag', 'start');
        return this.publicNoticeWebCrawlerService.stopOrStart(formData).subscribe(
            res => {
                if (res.success) {
                    // this.baseGrid.reload();
                    this.message.success(res.message);
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }

    stopBidding() {
        const formData = new FormData();
        formData.append('flag', 'stop');
        return this.publicNoticeWebCrawlerService.stopOrStartBidding(formData).subscribe(
            res => {
                if (res.success) {
                    this.message.success(res.message);
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }

    startBidding() {
        const formData = new FormData();
        formData.append('flag', 'start');
        return this.publicNoticeWebCrawlerService.stopOrStartBidding(formData).subscribe(
            res => {
                if (res.success) {
                    this.message.success(res.message);
                } else {
                    this.message.error(res.errorMessage);
                }
            }
        );
    }



}
