import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseGridComponent, BaseService, ReturnForm} from '@sb/base';
import {UserRoleService} from '../service/user-role.service';
import {SFSchema} from '@delon/form';
import {UserRoleSearchForm} from '../entity/user-role-search-form';
import {ActivatedRoute, Router} from '@angular/router';
import {RmRoleSelectSelectConfig} from '../../../rm/rm-role/rm-role-select/rm-role-select.component';
import {UserRole} from '../entity/user-role';
import {of} from 'rxjs';
import {OuOrg} from '../../../ou/ou-org/entity/ou-org';
import {OuOrgSearchConfig} from '../../../ou/ou-org/entity/ou-org-search-config';
import {OuOrgTreeNode} from '../../../ou/ou-org/entity/ou-org-tree-node';

@Component({
    selector: 'user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: UserRoleService
        }
    ]
})
export class UserRoleComponent implements OnInit {
    @Input()
    type: 'user' | 'role' = 'user';

    activeNode: OuOrg;

    searchConfig: OuOrgSearchConfig = {
        searchSubOrg: true,
        searchDept: true,
        searchUser: true,
    };

    searchForm: UserRoleSearchForm = {};

    @ViewChild(BaseGridComponent, {static: false})
    baseGrid: BaseGridComponent;

    reload() {
        this.baseGrid.reload();
    }

    schema: SFSchema = {
        properties: {
            roleIds: {
                type: 'string',
                title: '角色列表',
                ui: {
                    widget: 'rm-role-select',
                    loadingTip: '正在加载中...',
                    spanLabel: 6,
                    spanControl: 16,
                    config: {
                        searchForm: {
                            permission: true
                        },
                        notShow: [],
                        multiple: true,
                        valueType: 'array'
                    } as RmRoleSelectSelectConfig,
                }
            },
        },
        required: ['roleIds']
    } as SFSchema;

    constructor(
        private message: NzMessageService,
        private activatedRoute: ActivatedRoute,
        private userRoleService: UserRoleService,
        private router: Router) {
    }


    ngOnInit(): void {
    }


    selectNode(selectedNodeTreeNode: OuOrgTreeNode): void {
        this.activeNode = selectedNodeTreeNode.data;
        this.searchForm.userId = this.activeNode.userId;
        this.reload();
    }

    recordWrapper(value) {
        Object.assign(value, this.searchForm);
        this.updateScheme();
        return value;
    }

    updateScheme() {
        let d = this.baseGrid.tableData as UserRole[];
        let noShowRoleIds = d.map(value => value.roleId);
        this.schema = {
            properties: {
                roleIds: {
                    type: 'string',
                    title: '角色列表',
                    ui: {
                        widget: 'rm-role-select',
                        loadingTip: '正在加载中...',
                        spanLabel: 6,
                        spanControl: 16,
                        config: {
                            searchForm: {permission: true},
                            notShow: noShowRoleIds,
                            multiple: true,
                            valueType: 'array'
                        } as RmRoleSelectSelectConfig,
                    }
                },
            },
            required: ['roleIds'],
        } as SFSchema;
    }

    customLoadMethod(searchForm: UserRoleSearchForm, userRoleService: UserRoleService) {
        if (this.type === 'user') {
            if (searchForm.userId) {
                return userRoleService.listByUserId(searchForm.userId);
            } else {
                return of({
                    success: true,
                    message: []
                } as ReturnForm<UserRole[]>)
            }
        } else {
            return userRoleService.listByRoleId(searchForm.roleId);
        }
    }

    customRemoveMethod(datas: UserRole[], userRoleService: UserRoleService) {
        if (this.type === 'user') {
            return userRoleService.removeByUserId(datas.map(v => v.roleId), this.searchForm.userId);
        } else {
            return userRoleService.removeByRoleId(this.searchForm.roleId, datas.map(v => v.userId));
        }
    }

    customCommitMethod(userRole: UserRole, userRoleService: UserRoleService) {
        if (this.type === 'user') {
            let arr = [];
            if (typeof userRole.roleIds === 'string') {
                arr = userRole.roleIds.split(",");
            } else {
                arr = userRole.roleIds;
            }
            return userRoleService.commitByUserId(arr, this.searchForm.userId);
        } else {
            let arr = [];
            if (typeof userRole.userIds === 'string') {
                arr = userRole.userIds.split(",");
            } else {
                arr = userRole.userIds;
            }
            return userRoleService.commitByRoleId(this.searchForm.roleId, arr);
        }
    }
}
