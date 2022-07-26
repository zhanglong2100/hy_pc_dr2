import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseService} from '@sb/base';
import {OuUserService} from '../ou-user.service';
import {SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {OuUser} from "../entity/ou-user";
import {map} from "rxjs/operators";
import {SessionUser} from "../../../../main/entity/session-user";
import {STData} from "@delon/abc";
import {Page} from "@sb/base/core";

@Component({
    selector: 'ou-user-modify',
    templateUrl: './ou-user-modify.component.html',
    styleUrls: ['./ou-user-modify.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuUserService
        }
    ]
})
export class OuUserModifyComponent implements OnInit {

    @Input()
    record: OuUser;

    @Output() eventClose = new EventEmitter<boolean>();

    schema: SFSchema = {
        properties: {
            userName: {
                type: 'string',
                title: '用户名',
                minLength: 2,
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
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
                    spanLabel: 6,
                    spanControl: 18
                },
                default: 'boy'
            },
            tel: {
                type: 'string',
                title: '电话',
                maxLength: 30,
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            },
            loginName: {
                type: 'string',
                title: '登录名',
                minLength: 2,
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            },
            email: {
                type: 'string',
                title: '邮箱',
                format: 'email',
                maxLength: 30,
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            },
            officeTel: {
                type: 'string',
                title: '办公电话',
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            },
            qq: {
                type: 'string',
                title: 'qq号',
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            },
            wechat: {
                type: 'string',
                title: '微信号',
                ui: {
                    spanLabel: 6,
                    spanControl: 18
                }
            }
        },
        required: ['userName', 'loginName', 'tel'],
        ui: {
            grid: {
                span: 12
            }
        }
    } as SFSchema;

    constructor(
        private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    close() {
        this.eventClose.emit();
    }

    customCommitMethod(ouUser: OuUser, baseService: BaseService<STData, Page>) {
        return baseService.commit(ouUser).pipe(
            map(
                res => {
                    if (res.success) {
                        this.record.userName = ouUser.userName;
                        this.record.loginName = ouUser.loginName;
                        this.record.email = ouUser.email;
                        this.record.sex = ouUser.sex;
                        this.record.tel = ouUser.tel;
                        window.localStorage.setItem('sessionUser', JSON.stringify(this.record as SessionUser));
                    }
                    return res;
                }
            )
        );
    }
}
