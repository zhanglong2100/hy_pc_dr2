import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseGridComponent, BaseService, Page, ReturnForm, ReturnPage} from '@sb/base';
import {STColumn, STData} from '@delon/abc';
import {SFComponent, SFRadioWidgetSchema, SFSchema, SFStringWidgetSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {OuOrgSearchConfig} from '../../ou-org/entity/ou-org-search-config';
import {OuOrgTreeNode} from '../../ou-org/entity/ou-org-tree-node';
import {OuOrg} from '../../ou-org/entity/ou-org';
import {OuOrgUserService} from '../service/ou-org-user.service';
import {OuOrgUserSearchForm} from '../entity/ou-org-user-search-form';
import {OuUserSelectAlainSchema} from '../../ou-user/ou-user-select-alain/ou-user-select-alain.component';
import {OuOrgUserTreeSelectAlainSchema} from '../../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.component';
import {OuUserService} from '../../ou-user/ou-user.service';
import {Observable} from 'rxjs';
import {OuOrgUser} from '../entity/ou-org-user';

@Component({
    selector: 'ou-org-user',
    templateUrl: './ou-org-user.component.html',
    styleUrls: ['./ou-org-user.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuOrgUserService
        }
    ]
})
export class OuOrgUserComponent implements OnInit {
    // _showLoadPanel = false;
    activeNode: OuOrg;

    baseParam: OuOrgUserSearchForm = {
        orgId: '-1'
    };

    searchConfig: OuOrgSearchConfig = {
        searchSubOrg: true,
        searchDept: true,
        searchUser: false,
    };

    @ViewChild('baseGrid', {static: false})
    baseGrid: BaseGridComponent;

    columns: STColumn[] = [
        {
            title: '',
            type: 'checkbox',
            index: 'userId',
            width: '5%',
            className: 'text-center word-wrap'
        }, {
            title: '用户名',
            index: 'userName',
            width: '14%',
            className: 'text-center word-wrap'
        }, {
            title: '机构',
            index: 'orgName',
            width: '15%',
            className: 'text-center word-wrap'
        }, {
            title: '岗位',
            index: 'positionName',
            width: '11%',
            className: 'text-center word-wrap'
        }, {
            title: '登录名',
            index: 'loginName',
            width: '15%',
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
            width: '6%',
            className: 'text-center word-wrap'
        }, {
            title: '状态',
            index: 'active',
            format: (data: STData, col: STColumn) => {
                return data.active ? '启用' : '停用';
            },
            width: '6%',
            className: 'text-center word-wrap'
        }, {
            title: '操作区',
            width: '16%',
            className: 'text-center word-wrap',
            buttons: []
        }

    ];

    schema: SFSchema = {
        properties: {
            addType: {
                type: 'string',
                title: '新增类型',
                enum: [{label: '新建用户', value: 'ADD'}, {label: '选择已存在用户', value: 'IMPORT'}],
                default: 'ADD',
                ui: {
                    spanLabelFixed: 120,
                    spanLabel: 6,
                    spanControl: 18,
                    widget: 'radio',
                    grid: {
                        span: 24,
                    }
                } as SFRadioWidgetSchema,
            },
            userName: {
                type: 'string',
                title: '用户名称',
                minLength: 2,
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    spanLabelFixed: 120,
                    visibleIf: {
                        addType: ['ADD']
                    }
                } as SFStringWidgetSchema,
            },
            tel: {
                type: 'string',
                title: '联系电话',
                maxLength: 30,
                pattern: '^1[0-9]{10}$',
                ui: {
                    width: 375,
                    errors: {pattern: '请输入11位手机号码'},
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                } as SFStringWidgetSchema,
            },
            loginName: {
                type: 'string',
                title: '登录名称',
                minLength: 2,
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    spanLabelFixed: 120,
                    visibleIf: {
                        addType: ['ADD']
                    }
                } as SFStringWidgetSchema,
            },
            orgId: {
                type: 'string',
                title: '机构部门',
                ui: {
                    width: 375,
                    widget: 'ou-org-user-tree-select-alain',
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    searchConfig: {
                        searchDept: true,
                        searchSubOrg: true,
                        searchUser: false
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                } as OuOrgUserTreeSelectAlainSchema
            },
            positionId: {
                type: 'string',
                title: '所属岗位',
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    spanLabelFixed: 120,
                    widget: 'ou-position-select-alain'
                } as OuUserSelectAlainSchema,
            },
            sex: {
                type: 'string',
                title: '性别',
                enum: [{
                    value: 'boy',
                    label: '男'
                }, {
                    value: 'girl',
                    label: '女'
                }],
                ui: {
                    widget: 'radio',
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                },
                default: 'boy'
            },
            // startDate: {
            //     type: 'string',
            //     title: '生效日期',
            //     format: 'date-time',
            //     ui: {
            //         spanLabel: 6,
            //         spanControl: 18,
            //         visibleIf: {
            //             addType: ['ADD']
            //         }
            //     }
            // },
            officeTel: {
                type: 'string',
                title: '办公电话',
                pattern: '(0[1-9]{2,3})',
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    errors: {pattern: '请输入正确办公电话'},
                    spanLabelFixed: 120,
                    visibleIf: {
                        addType: ['ADD']
                    }
                }
            },
            email: {
                type: 'string',
                title: '电子邮箱',
                maxLength: 30,
                format: 'email',
                ui: {
                    width: 375,
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                }
            },
            wechat: {
                type: 'string',
                title: '微 信 号',
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    spanLabelFixed: 120,
                    spanControl: 18,
                    visibleIf: {
                        addType: ['ADD']
                    }
                }
            },
            qq: {
                type: 'string',
                title: 'QQ号码',
                pattern: '^[1-9]\\d{3,9}$',
                ui: {
                    width: 375,
                    errors: {pattern: '请填写正确的QQ号码'},
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                }
            },
            endDate: {
                type: 'string',
                title: '失效日期',
                format: 'date-time',
                ui: {
                    width: 375,
                    grid: {
                        span: 15,
                    },
                    spanLabelFixed: 120,
                    visibleIf: {
                        addType: ['ADD']
                    }
                }
            },
            userIds: {
                type: 'string',
                title: '选择用户',
                ui: {
                    widget: 'ou-user-select-alain',
                    valueType: 'array',
                    multiple: true,
                    visibleIf: {
                        addType: ['IMPORT']
                    },
                    spanLabelFixed: 120,
                    grid: {
                        span: 22,
                    }
                } as OuUserSelectAlainSchema
            },
            active: {
                type: 'boolean',
                title: '帐号状态',
                ui: {
                    checkedChildren: '启用',
                    unCheckedChildren: '停用',
                    spanLabelFixed: 140,
                    grid: {
                        span: 9,
                    },
                    visibleIf: {
                        addType: ['ADD']
                    }
                },
                default: true
            },
        },
        required: ['userName', 'tel', 'loginName', 'orgId', 'userIds'],
        ui: {
            spanLabelFixed: 100,
            grid: {
                span: 12,
            }
        }
    } as SFSchema;

    constructor(
        private ouUserService: OuUserService,
        private ouOrgUserService: OuOrgUserService,
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    selectNode(selectedNodeTreeNode: OuOrgTreeNode): void {
        this.activeNode = selectedNodeTreeNode.data;
        this.baseParam.orgId = selectedNodeTreeNode.key;
        this.baseGrid.reload();
    }


    beforeDataRender(data: STData[]): STData[] {
        data.map(v => v.addType = 'ADD');
        return data;
    }

    customDetailClick(data: any) {
        this.schema.properties.addType.readOnly = data.detailPanelType !== 'add';
    }

    /**
     * 使用自定义 加载方法
     * @param searchForm 分页信息
     * @param baseService baseService
     */
    customLoadPageMethod(searchForm: OuOrgUserSearchForm, baseService?: BaseService<STData, Page>): Observable<ReturnForm<ReturnPage<OuOrgUser>>> {
        return this.ouOrgUserService.listWithUserDetail(searchForm);
    }

    customCommitMethod(form: OuOrgUser, baseService?: BaseService<STData, Page>): Observable<ReturnForm<any>> {
        if (form.addType === 'ADD') {
            return this.ouOrgUserService.commit(form);
        } else {
            return this.ouOrgUserService.commitMulti(form.userIds, form.orgId, form.positionId);
        }
    }

    afterDetailInit(sf: SFComponent): void {
        sf.getProperty('/tel').valueChanges.subscribe((v) => {
            if (this.baseGrid.detailPanelType === 'add') {
                const loginNameProperty = sf.getProperty('/loginName');
                loginNameProperty.setValue(v, true);
            }
        });
    }

    resetPassword() {
        const userIds = this.baseGrid.checkData.map(v => v.userId);
        this.ouUserService.resetPassword(userIds).subscribe(
            res => {
                if (res.success) {
                    this.message.success('密码重置成功');
                } else {
                    this.message.error('重置密码错误：' + res.errorMessage);
                }
            }
        );
    }
}
