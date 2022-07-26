import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SFButton, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {PublicNotice} from '../entity/public-notice';
import {NzMessageService} from 'ng-zorro-antd';
import {ReturnForm} from '@sb/base';
import {PublicNoticeService} from '../public-notice.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'public-notice-detail',
    templateUrl: './public-notice-detail.component.html',
    styleUrls: ['./public-notice-detail.component.less']
})
export class PublicNoticeDetailComponent implements OnInit {

    // 表单数据结构
    schema: SFSchema;

    // 表单数据
    formData: PublicNotice = {} as PublicNotice;

    // 表单布局
    layout = 'horizontal';

    // 窗口标题
    title: string = null;

    // 操作类型
    detailPanelType: string = null ;

    button: SFButton = {
        render: {
            class: 'text-right'
        }
    };

    @Input('record')
    set selectedData(protocol: PublicNotice) {
        if (protocol.publicTime != null) {
            protocol.publicTime = protocol.publicTime.split(' ')[0];
        }
        const newProtocol = Object.assign({}, protocol);
        this.formData = newProtocol;
        // if (newProtocol.dealType === 'java_source') {
        //     try {
        //         const data = JSON.parse(protocol.dealExpress);
        //
        //         newProtocol.packageName = data.packageName;
        //         newProtocol.className = data.className;
        //         newProtocol.source = data.source;
        //     } catch (ignored) {
        //
        //     }
        // }
        // this.formChange(newProtocol);
    }

    @Input()
    usePopup = false;

    @Input('detailPanelType')
    set setDetailPanelType(detailPanelType: string) {
        this.detailPanelType = detailPanelType;
    }

    @Input('title')
    set setTitle(title: string) {
        if (this.detailPanelType === 'add') {
            this.title = '添加公告';
        } else {
            this.title = '编辑公告';
        }
        // this.title = title;
    }

    private _widgetType: 'small' | 'large' = 'small';

    get width() {
        if (this._widgetType === 'large') {
            return '70%';
        } else {
            return '800';
        }
    }

    get height() {
        if (this._widgetType === 'large') {
            return '80%';
        } else {
            return '70%';
        }
    }

    @Output() eventClose = new EventEmitter<boolean>();

    constructor(
        private msg: NzMessageService,
        private publicNoticeService: PublicNoticeService,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (!this.selectedData && params['id']) {
                // protocol: Protocol
                this.publicNoticeService.get(params['id']).subscribe((returnForm: ReturnForm<PublicNotice>) => {
                    if (returnForm.success) {
                        this.selectedData = returnForm.message;
                    }
                });
            }
        });
        const protocolId = this.activatedRoute.snapshot.queryParams['id'];

        if ('add' === this.detailPanelType) {
            this.schema = {
                properties: {
                    publicNoticeUrl: {
                        type: 'string',
                        title: '公告网址',
                        minLength: 16,
                        maxLength: 256
                    },
                    // businessType: {
                    //     type: 'string',
                    //     title: '业务类型',
                    //     enum: [
                    //         {label: '管网业务', value: '管网业务'},
                    //         {label: '测绘业务', value: '测绘业务'},
                    //         {label: '数据业务', value: '数据业务'},
                    //         {label: '信息业务', value: '信息业务'},
                    //         {label: '遥感业务', value: '遥感业务'},
                    //         {label: '规划业务', value: '规划业务'},
                    //     ]
                    // },
                    businessType: {
                        type: 'string',
                        title: '业务类型',
                        enum: [
                            {label: '大地测量', value: '大地测量'},
                            {label: '测绘航空摄影', value: '测绘航空摄影'},
                            {label: '摄影测量与遥感', value: '摄影测量与遥感'},
                            {label: '地理信息系统工程', value: '地理信息系统工程'},
                            {label: '工程测量', value: '工程测量'},
                            {label: '不动产测绘', value: '不动产测绘'},
                            {label: '海洋测绘', value: '海洋测绘'},
                            {label: '地图编制', value: '地图编制'},
                            {label: '导航电子地图制作', value: '导航电子地图制作'},
                            {label: '互联网地图服务', value: '互联网地图服务'},
                            {label: '市政工程', value: '市政工程'},
                            {label: '规划', value: '规划'},
                            {label: '数据工程', value: '数据工程'},
                            {label: '其他', value: '其他'}
                        ],
                        ui: {
                            widget: 'select'
                        }
                    },
                    province: {
                        type: 'string',
                        title: '省份',
                        enum: [
                            {label: '广东省内', value: '广东省内'},
                            {label: '广东省外', value: '广东省外'}
                        ]
                        // default: '广东省内'
                    },
                    city: {
                        type: 'string',
                        title: '地级市',
                        maxLength: 32
                    },
                    score: {
                        type: 'string',
                        title: '得分情况',
                        maxLength: 256
                    }
                },
                required: ['publicNoticeUrl']
            };
        } else if ('modify' === this.detailPanelType) {
            this.schema = {
                properties: {
                    publicNoticeUrl: {
                        type: 'string',
                        title: '公告网址',
                        minLength: 16,
                        maxLength: 256,
                        readOnly: true,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    month: {
                        type: 'string',
                        title: '月份',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    publicTime: {
                        type: 'string',
                        title: '发布时间',
                        format: 'date',
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    publicWeb: {
                        type: 'string',
                        title: '发布网站',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    province: {
                        type: 'string',
                        title: '省份',
                        enum: [
                            {label: '广东省内', value: '广东省内'},
                            {label: '广东省外', value: '广东省外'}
                        ],
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    city: {
                        type: 'string',
                        title: '地级市',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    county: {
                        type: 'string',
                        title: '县区',
                        maxLength: 64,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectCode: {
                        type: 'string',
                        title: '项目编号',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    projectName: {
                        type: 'string',
                        title: '项目名称',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    publicNoticeType: {
                        type: 'string',
                        title: '公告类型',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    purchaseType: {
                        type: 'string',
                        title: '采购方式',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    // businessType: {
                    //     type: 'string',
                    //     title: '业务类型',
                    //     enum: [
                    //         {label: '大地测量', value: '大地测量'},
                    //         {label: '测绘航空摄影', value: '测绘航空摄影'},
                    //         {label: '摄影测量与遥感', value: '摄影测量与遥感'},
                    //         {label: '地理信息系统工程', value: '地理信息系统工程'},
                    //         {label: '工程测量', value: '工程测量'},
                    //         {label: '不动产测绘', value: '不动产测绘'},
                    //         {label: '海洋测绘', value: '海洋测绘'},
                    //         {label: '地图编制', value: '地图编制'},
                    //         {label: '导航电子地图制作', value: '导航电子地图制作'},
                    //         {label: '互联网地图服务', value: '互联网地图服务'},
                    //         {label: '市政工程', value: '市政工程'},
                    //         {label: '规划', value: '规划'},
                    //         {label: '数据工程', value: '数据工程'},
                    //         {label: '其他', value: '其他'}
                    //     ],
                    //     ui: {
                    //         widget: 'select'
                    //     }
                    // },
                    businessType: {
                        type: 'string',
                        title: '业务类型',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                        // enum: [
                        //     {label: '大地测量', value: '大地测量'},
                        //     {label: '测绘航空摄影', value: '测绘航空摄影'},
                        //     {label: '摄影测量与遥感', value: '摄影测量与遥感'},
                        //     {label: '地理信息系统工程', value: '地理信息系统工程'},
                        //     {label: '工程测量', value: '工程测量'},
                        //     {label: '不动产测绘', value: '不动产测绘'},
                        //     {label: '海洋测绘', value: '海洋测绘'},
                        //     {label: '地图编制', value: '地图编制'},
                        //     {label: '导航电子地图制作', value: '导航电子地图制作'},
                        //     {label: '互联网地图服务', value: '互联网地图服务'},
                        //     {label: '市政工程', value: '市政工程'},
                        //     {label: '规划', value: '规划'},
                        //     {label: '数据工程', value: '数据工程'},
                        //     {label: '其他', value: '其他'}
                        // ],
                        // ui: {
                        //     widget: 'select',
                        //     mode: 'tags',
                        //     maxMultipleCount: 3
                        // }as SFSelectWidgetSchema,
                        // default: null
                    },
                    // businessType: {
                    //     type: 'string',
                    //     title: '业务类型',
                    //     enum: [
                    //         {label: '大地测量', value: '大地测量'},
                    //         {label: '测绘航空摄影', value: '测绘航空摄影'},
                    //         {label: '摄影测量与遥感', value: '摄影测量与遥感'},
                    //         {label: '地理信息系统工程', value: '地理信息系统工程'},
                    //         {label: '工程测量', value: '工程测量'},
                    //         {label: '不动产测绘', value: '不动产测绘'},
                    //         {label: '海洋测绘', value: '海洋测绘'},
                    //         {label: '地图编制', value: '地图编制'},
                    //         {label: '导航电子地图制作', value: '导航电子地图制作'},
                    //         {label: '互联网地图服务', value: '互联网地图服务'},
                    //         {label: '市政工程', value: '市政工程'},
                    //         {label: '规划', value: '规划'},
                    //         {label: '数据工程', value: '数据工程'},
                    //         {label: '其他', value: '其他'}
                    //     ],
                    //     ui: {
                    //         widget: 'select',
                    //         mode: 'multiple',
                    //         maxMultipleCount: 3
                    //     },
                    //     default: []
                    // },
                    budget: {
                        type: 'string',
                        title: '预算金额',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    score: {
                        type: 'string',
                        title: '得分情况',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    biddingTime: {
                        type: 'string',
                        title: '获取招标文件时间',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    endTime: {
                        type: 'string',
                        title: '提交投标文件截止时间',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    purchaseUser: {
                        type: 'string',
                        title: '采购人信息名称',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    purchaseUserContactWay: {
                        type: 'string',
                        title: '采购联系方式',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    purchaseOrganization: {
                        type: 'string',
                        title: '采购代理机构',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    purchaseOrganizationContactWay: {
                        type: 'string',
                        title: '代理机构联系方式',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectLeader: {
                        type: 'string',
                        title: '项目负责人',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectManager: {
                        type: 'string',
                        title: '项目经办人',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectContact: {
                        type: 'string',
                        title: '项目联系人',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectContactNumber: {
                        type: 'string',
                        title: '项目联系人电话',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    bidUrl: {
                        type: 'string',
                        title: '中标链接',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    winningUnit: {
                        type: 'string',
                        title: '中标单位',
                        maxLength: 512,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    reviewExperts: {
                        type: 'string',
                        title: '评审专家',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    bidPrice: {
                        type: 'string',
                        title: '中标金额',
                        maxLength: 512,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    }
                },
                ui: {
                    grid: {
                        span: 12
                    },
                    spanLabelFixed: 150
                },
                required: ['publicNoticeUrl']
            };
        }


    }

    formChange(publicNotice: PublicNotice) {
             return;
    }

    /**
     * 提交表单
     */
    submit(protocol: PublicNotice) {
        const messageId = this.msg.loading('正在解析网址...', {nzDuration: 0}).messageId;
        protocol = Object.assign({}, protocol);
        this.publicNoticeService.commit(protocol).subscribe((returnForm: ReturnForm<PublicNotice>) => {
            this.msg.remove(messageId);
            if (returnForm.success) {
                this.msg.success('保存成功！');
                this.doClose(true);
            } else {
                this.msg.error(returnForm.errorMessage);
            }
        });
    }

    /**
     * 关闭窗口
     */
    closeClick() {
        this.doClose(false);
    }

    /**
     * 关闭
     */
    private doClose(value) {
        this.eventClose.emit(value);
    }
}
