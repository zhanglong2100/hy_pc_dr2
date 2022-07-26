import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UserRoleComponent} from './user-role/user-role.component';
import {UserRoleRoutingModule} from './user-role-routing.module';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzPopconfirmModule} from 'ng-zorro-antd';
import {BaseGridModule} from '@sb/base';
import {OuUserSelectPanelModule} from '../../ou/ou-user/ou-user-select-panel/ou-user-select-panel.module';
import {RmRoleSelectModule} from '../../rm/rm-role/rm-role-select/rm-role-select.module';
import {OuOrgUserTreeSelectPanelModule} from '../../ou/ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.module';


@NgModule({
    imports: [
        CommonModule,
        UserRoleRoutingModule,
        RmRoleSelectModule,
        FormsModule,
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NzPopconfirmModule,
        NzGridModule,
        OuUserSelectPanelModule,
        NzCardModule,
        OuOrgUserTreeSelectPanelModule,
    ],
    declarations: [
        UserRoleComponent,
    ]
})
export class UserRoleModule {
}
