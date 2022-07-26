import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OuOrgUserService} from '../service/ou-org-user.service';
import {SFButton, SFSchema} from '@delon/form';
import {OuUserSelectAlainSchema} from '../../ou-user/ou-user-select-alain/ou-user-select-alain.component';
import {NzMessageService} from 'ng-zorro-antd';
import {OuOrgUserTreeSelectPanelComponent} from '../../ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.component';
import {OuOrgUserTreeSelectAlainSchema} from '../../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.component';

@Component({
    selector: 'v    create-user-and-load',
    templateUrl: './create-user-and-load.component.html',
    styleUrls: ['./create-user-and-load.component.less']
})
export class CreateUserAndLoadComponent implements OnInit {

    @Input()
    private orgId: string;

    @Output()
    closePanel = new EventEmitter();

    record: {
        orgId?: string;
    } = {};

    detailButton: SFButton = {
        render: {
            class: 'text-right'
        }
    };

    schema: SFSchema;

    constructor(private ouOrgUserService: OuOrgUserService,
                private nzMessageService: NzMessageService) {
    }

    ngOnInit() {
        if (!this.orgId) {
            throw new Error('机构标识不允许为空！');
        }

        this.record.orgId = this.orgId;

        this.schema = {
            properties: {
                userName: {
                    type: 'string',
                    title: '用户名',
                    minLength: 2
                },
                loginName: {
                    type: 'string',
                    title: '登录名',
                    minLength: 2
                },
                orgId: {
                    type: 'string',
                    title: '机构',
                    ui: {
                        widget: 'ou-org-user-tree-select-alain',
                        searchConfig:{
                            searchDept: true,
                            searchSubOrg: true,
                            searchUser: false
                        }
                    } as OuOrgUserTreeSelectAlainSchema
                },
                positionId: {
                    type: 'string',
                    title: '岗位',
                    ui: {
                        widget: 'ou-position-select-alain',
                    } as OuUserSelectAlainSchema
                },
                email: {
                    type: 'string',
                    title: '邮箱',
                    format: 'email',
                    maxLength: 30,
                },
                password: {
                    type: 'string',
                    title: '密码',
                    maxLength: 30,
                    ui: {
                        type: 'password'
                    }
                },
                active: {
                    type: 'boolean',
                    title: '状态',
                    ui: {
                        checkedChildren: '启用',
                        unCheckedChildren: '停用',
                    },
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
                    }]
                },
                tel: {
                    type: 'string',
                    title: '电话',
                    maxLength: 30,
                }
            },
            required: ['userName', 'loginName', 'password', 'active'],
            ui: {
                grid: {
                    span: 12
                }
            }
        };
    }

    submit(value) {
        this.ouOrgUserService
            .commit(value)
            .subscribe(returnForm => {
                if (returnForm.success) {
                    this.nzMessageService.warning('创建并导入成功！');
                    this.closePanel.emit();
                } else {
                    this.nzMessageService.warning('创建并导入不成功！错误：' + returnForm.errorMessage);
                }
            });
    }
}
