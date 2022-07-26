import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {BaseService} from '@sb/base';
import {OuUserService} from '../ou-user.service';
import {ErrorData, FormProperty, PropertyGroup, SFSchema} from '@delon/form';
import {NzMessageService} from 'ng-zorro-antd';
import {map} from "rxjs/operators";
import {OuPasswordModify} from "../entity/ou-password-modify";
import {MenuService} from "../../../../main/service/menu.service";
import {MainService} from "../../../../main/service/main.service";
import {Router} from "@angular/router";
import {BaseDetailComponent} from "@sb/base/detail";

@Component({
    selector: 'ou-password-modify',
    templateUrl: './ou-password-modify.component.html',
    styleUrls: ['./ou-password-modify.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuUserService
        }
    ]
})
export class OuPasswordModifyComponent implements OnInit {

    record: OuPasswordModify;

    @Output() eventClose = new EventEmitter<boolean>();

    @ViewChild(BaseDetailComponent, {static: false})
    baseDetail: BaseDetailComponent;

    schema: SFSchema = {
        properties: {
            oldPassword: {
                type: 'string',
                title: '旧密码',
                minLength: 3,
                ui: {
                    type: 'password'
                }
            },
            newPassword: {
                type: 'string',
                title: '新密码',
                minLength: 3,
                ui: {
                    type: 'password'
                }
            },
            affirmPassword: {
                type: 'string',
                title: '确认密码',
                minLength: 3,
                ui: {
                    type: 'password',
                    validator: (value: any, formProperty: FormProperty, form: PropertyGroup) => {
                        let errorData = [] as ErrorData[];
                        let newPassword = form.getProperty("newPassword").value;
                        if (newPassword !== value) {
                            errorData.push(
                                {
                                    keyword: '',
                                    message: '两次输入的密码不相同'
                                }
                            );
                        }
                        return errorData;
                    }
                }
            }
        },
        required: ['oldPassword', 'newPassword', 'affirmPassword'],
    } as SFSchema;

    constructor(
        private message: NzMessageService,
        private menuService: MenuService,
        private mainService: MainService,
        private router: Router) {
    }

    ngOnInit(): void {

    }

    // ngAfterViewInit(): void {
    //     this.baseDetail.sf.rootProperty.getProperty("newPassword").valueChanges.subscribe(
    //         v => {
    //             this.baseDetail.sf.validator();
    //         }
    //     );
    // }

    close() {
        this.eventClose.emit();
    }

    customCommitMethod(ouPasswordModify: OuPasswordModify, ouUserService: OuUserService) {
        return ouUserService.modifyPassword(ouPasswordModify).pipe(
            map(
                res => {
                    if (res.success) {
                        this.menuService.clearCache();
                        this.mainService.logout().subscribe(() => {
                            this.router.navigate(['login']);
                        });
                    }
                    return res;
                }
            )
        );
    }
}
