import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseService} from '@sb/base';
import {OuUserService} from '../ou-user.service';
import {STColumn, STData} from '@delon/abc';
import {SFComponent, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {OuOrgSearchConfig} from '../../ou-org/entity/ou-org-search-config';
import {OuOrgTreeNode} from '../../ou-org/entity/ou-org-tree-node';
import {OuOrg} from '../../ou-org/entity/ou-org';
import {OuUserSearchForm} from '../entity/ou-user-search-form';
import {OuUser} from "../entity/ou-user";

@Component({
    selector: 'ou-user',
    templateUrl: './ou-user.component.html',
    styleUrls: ['./ou-user.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuUserService
        }
    ]
})
export class OuUserComponent implements OnInit, AfterViewInit {

    searchValue: string;

    activeNode: OuOrg;
    searchForm: OuUserSearchForm = {};

    searchConfig: OuOrgSearchConfig = {
        searchSubOrg: true,
        searchDept: true,
        searchUser: false,
    };


    @ViewChild("baseGrid", {static: false})
    baseGrid: BaseGridComponent;

    test() {
        this.baseGrid.addClick();
    }

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'userId',
            width: '6%',
            className: 'text-center word-wrap'
        }, {
            title: '用户名',
            index: 'userName',
            width: '12%',
            className: 'text-center word-wrap'
        }, {
            title: '登录名',
            index: 'loginName',
            width: '12%',
            className: 'text-center word-wrap'
        }, {
            title: '性别',
            index: 'sex',
            format: (data: STData, col: STColumn) => {
                if (data.sex === 'boy') {
                    return '男';
                } else if (data.sex === 'girl') {
                    return '女';
                } else {
                    return '';
                }
            },
            width: '8%',
            className: 'text-center word-wrap'
        }, {
            title: '电话',
            index: 'tel',
            width: '11%',
            className: 'text-center word-wrap'
        }, {
            title: '状态',
            index: 'active',
            format: (data: STData, col: STColumn) => {
                return data.active ? "启用" : "停用";
            },
            width: '8%',
            className: 'text-center word-wrap'
        },
        {
            title: '创建时间',
            index: 'createTime',
            width: '15%',
            className: 'text-center word-wrap'
        },
        {
            title: '最后更新时间',
            index: 'lastModifyTime',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            className: 'text-center word-wrap',
            buttons: []
        }
    ];

    schema: SFSchema;

    constructor(
        private message: NzMessageService,
        private ouUserService: OuUserService) {
    }

    ngOnInit(): void {
        this.updateSchema(null)
    }


    selectNode(selectedNodeTreeNode: OuOrgTreeNode): void {

        this.baseGrid.reload();
    }

    recordWrapper(value) {
        this.updateSchema(value);
        return value;
    }

    updateSchema(value: OuUser) {
        let flag = !(value && value.userId);
        this.schema = {
            properties: {
                userName: {
                    type: 'string',
                    title: '用户名称',
                    minLength: 2,
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                },
                // password: {
                //     type: 'string',
                //     title: '密码',
                //     minLength: 2,
                //     ui: {
                //         type: 'password',
                //         spanLabel: 6,
                //         spanControl: 18
                //     }
                // },
                tel: {
                    type: 'string',
                    title: '联系电话',
                    format: 'regex',
                    pattern: '^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\\d{8})$',
                    ui: {
                        grid: {
                            span: 9,
                        },
                        errors: {'pattern': '请输入有效的电话号码'}
                    }
                },
                loginName: {
                    type: 'string',
                    title: '登录名称',
                    minLength: 2,
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                },
                // orgId: {
                //     type: 'string',
                //     title: '机构部门',
                //     ui: {
                //         widget: 'ou-org-user-tree-select-alain',
                //         width: 375,
                //         spanLabel: 6,
                //         spanControl: 16,
                //         grid: {
                //             span: 9,
                //         },
                //         searchConfig: {
                //             searchDept: true,
                //             searchSubOrg: true,
                //             searchUser: false
                //         },
                //         visibleIf: {
                //             addType: ['ADD']
                //         }
                //     } as OuOrgUserTreeSelectAlainSchema
                // },
                // positionId: {
                //     type: 'string',
                //     title: '所属岗位',
                //     ui: {
                //         width: 350,
                //         grid: {
                //             span: 15,
                //         },
                //         spanLabel: 6,
                //         spanControl: 18,
                //         widget: 'ou-position-select-alain'
                //     } as OuUserSelectAlainSchema,
                // },
                sex: {
                    type: 'string',
                    title: '用户性别',
                    enum: [{
                        value: 'boy',
                        label: '男'
                    }, {
                        value: 'girl',
                        label: '女'
                    }],
                    ui: {
                        widget: 'radio',
                        grid: {
                            span: 9,
                        },
                    },
                    default: 'boy'
                },
                // startDate: {
                //     type: 'string',
                //     title: '生效日期',
                //     format: 'date-time',
                //     ui: {
                //         spanLabel: 6,
                //         spanControl: 18
                //     }
                // },
                officeTel: {
                    type: 'string',
                    title: '办公电话',
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                },
                email: {
                    type: 'string',
                    title: '电子邮箱',
                    format: "email",
                    ui: {
                        grid: {
                            span: 9,
                        },
                    }
                },
                wechat: {
                    type: 'string',
                    title: '微 信 号',
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                },
                qq: {
                    type: 'string',
                    title: 'Q Q号码',
                    ui: {
                        grid: {
                            span: 9,
                        },
                    }
                },

                endDate: {
                    type: 'string',
                    title: '失效日期',
                    format: 'date-time',
                    ui: {
                        grid: {
                            span: 15,
                        },
                    }
                },
                active: {
                    type: 'boolean',
                    title: '办公状态',
                    ui: {
                        checkedChildren: '启用',
                        unCheckedChildren: '停用',
                        grid: {
                            span: 9,
                        },
                    },
                    default: true
                },
            },
            required: ['userName', 'loginName', flag ? 'password' : '', 'tel'],
            ui: {
                width: 375,
                spanLabelFixed: 120,
                grid: {
                    span: 12
                }
            }
        } as SFSchema
    }

    resetPassword() {
        let userIds = this.baseGrid.checkData.map(v => v.userId);
        this.ouUserService.resetPassword(userIds).subscribe(
            res => {
                if (res.success) {
                    this.message.success('密码重置成功');
                } else {
                    this.message.error("重置密码错误：" + res.errorMessage);
                }
            }
        );
    }

    afterDetailInit(sf: SFComponent): void {
        sf.getProperty('/tel').valueChanges.subscribe((v) => {
            if (this.baseGrid.detailPanelType === 'add') {
                let loginNameProperty = sf.getProperty('/loginName');
                loginNameProperty.setValue(v, true);
            }
        });
    }

    doSearch() {
        this.searchForm.loginName = this.searchForm.userName = this.searchValue.trim().replace(' ', '');
        this.baseGrid.reload();
    }

    redo() {
        this.searchValue = null;
        delete this.searchForm.loginName;
        delete this.searchForm.userName;
        this.baseGrid.reload();
    }

    ngAfterViewInit(): void {

    }

}
