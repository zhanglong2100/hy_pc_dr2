import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SFButton, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {AgencySupermarket} from '../entity/agency-supermarket';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseService, Page, ReturnForm} from '@sb/base';
import {AgencySupermarketService} from '../agency-supermarket.service';
import {ActivatedRoute, Params} from '@angular/router';
import {SysCodeService} from '../../../system/sys/sys-code/service/sys-code.service';
import {DatePipe} from '@angular/common';


@Component({
    selector: 'agency-supermarket-detail',
    templateUrl: './agency-supermarket-detail.component.html',
    styleUrls: ['./agency-supermarket-detail.component.less']

})
export class AgencySupermarketDetailComponent implements OnInit {

    // 表单数据结构
    schema: SFSchema;

    // 表单数据
    formData: AgencySupermarket = {} as AgencySupermarket;

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
    set selectedData(agencySupermarket: AgencySupermarket) {
        if (agencySupermarket.publicTime != null) {
            // agencySupermarket.publicTime = agencySupermarket.publicTime.split(' ')[0];
        }
        const newProtocol = Object.assign({}, agencySupermarket);
        this.formData = newProtocol;
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
            this.title = '添加中介超市公告';
        } else {
            this.title = '编辑中介超市公告';
        }
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
        private agencySupermarketService: AgencySupermarketService,
        private sysCodeService: SysCodeService,
        private datePipe: DatePipe,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit() {

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (!this.selectedData && params['id']) {
                this.agencySupermarketService.get(params['id']).subscribe((returnForm: ReturnForm<AgencySupermarket>) => {
                    if (returnForm.success) {
                        this.selectedData = returnForm.message;
                    }
                });
            }
        });

        if ('add' === this.detailPanelType) {
            this.schema = {
                properties: {
                    publicNoticeUrl: {
                        type: 'string',
                        title: '公告网址',
                        minLength: 16,
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    // businessType: {
                    //     type: 'string',
                    //     title: '业务类型',
                    //     ui: {
                    //         grid: {
                    //             span: 12
                    //         },
                    //         widget: 'sys-code-select-alain2',
                    //         category: 'PROJECT_TYPE'
                    //     }as SysCodeSelectAlainSchema
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
                            widget: 'select',
                            grid: {
                                span: 24
                            }
                        }
                    },
                    publicTime: {
                        type: 'string',
                        title: '发布时间',
                        format: 'date-time',
                        ui: {
                            width: 400,
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectApprovalCode: {
                        type: 'string',
                        title: '立项编号',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    marketPerson: {
                        type: 'string',
                        title: '市场人员',
                        maxLength: 64,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    enteringPerson: {
                        type: 'string',
                        title: '录入人员',
                        maxLength: 64,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifProjectApproval: {
                        type: 'string',
                        title: '是否立项',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        default: '0',
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifApply: {
                        type: 'string',
                        title: '是否报名',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        default: '0',
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifBidding: {
                        type: 'string',
                        title: '是否中标',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        default: '0',
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifArchive: {
                        type: 'string',
                        title: '是否归档',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        default: '0',
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    remark: {
                        type: 'string',
                        title: '备注',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
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
                    orderNum: {
                        type: 'string',
                        title: ' 序号',
                        readOnly: true,
                        maxLength: 10,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    // businessType: {
                    //     type: 'string',
                    //     title: '业务类型',
                    //     ui: {
                    //         // widget: 'select',
                    //         grid: {
                    //             span: 12
                    //         },
                    //         widget: 'sys-code-select-alain2',
                    //         category: 'PROJECT_TYPE'
                    //     }as SysCodeSelectAlainSchema
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
                    area: {
                        type: 'string',
                        title: '地区',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifProjectApproval: {
                        type: 'string',
                        title: '是否立项',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    projectApprovalCode: {
                        type: 'string',
                        title: '立项编号',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
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
                    ownerUnit: {
                        type: 'string',
                        title: '业主单位',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 24
                            }
                        }
                    },
                    agencySupermarket: {
                        type: 'string',
                        title: '中介超市',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    budget: {
                        type: 'string',
                        title: '金额',
                        maxLength: 128,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    publicTime: {
                        type: 'string',
                        title: '发布时间',
                        // format: 'date-time',
                        // maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    endTime: {
                        type: 'string',
                        title: '报名截止时间',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    chooseType: {
                        type: 'string',
                        title: '选取方式',
                        maxLength: 32,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifApply: {
                        type: 'string',
                        title: '是否报名',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifBidding: {
                        type: 'string',
                        title: '是否中标',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    ifArchive: {
                        type: 'string',
                        title: '是否归档',
                        enum: [
                            {label: '否', value: '0'},
                            {label: '是', value: '1'}
                        ],
                        ui: {
                            widget: 'select',
                            grid: {
                                span: 12
                            }
                        }
                    },
                    marketPerson: {
                        type: 'string',
                        title: '市场人员',
                        maxLength: 64,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    enteringPerson: {
                        type: 'string',
                        title: '录入人员',
                        maxLength: 64,
                        ui: {
                            grid: {
                                span: 12
                            }
                        }
                    },
                    remark: {
                        type: 'string',
                        title: '备注',
                        maxLength: 256,
                        ui: {
                            grid: {
                                span: 24
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
                required: ['publicNoticeUrl', 'publicTime']
            };
        }


    }

    formChange(agencySupermarket: AgencySupermarket) {
             return;
    }

    /**
     * 提交表单
     */
    submit(agencySupermarket: AgencySupermarket) {
        agencySupermarket = Object.assign({}, agencySupermarket);

        if (agencySupermarket.publicTime) {
                agencySupermarket.publicTime = this.datePipe.transform(agencySupermarket.publicTime, 'yyyy-MM-dd HH:mm:ss');
            }

        this.agencySupermarketService.commit(agencySupermarket).subscribe((returnForm: ReturnForm<AgencySupermarket>) => {
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
