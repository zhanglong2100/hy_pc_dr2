import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuOrgUserComponent} from './ou-org-user/ou-org-user.component';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule, NzPopconfirmModule} from 'ng-zorro-antd';
import {OuOrgUserTreeSelectPanelModule} from '../ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.module';
import {OuOrgUserTreeSelectModule} from '../ou-org-user-tree-select/ou-org-user-tree-select.module';
import {FormsModule} from '@angular/forms';
import {BaseGridModule, BasePopupModule} from '@sb/base';
import {OuOrgUserRoutingModule} from './ou-org-user-routing.module';
import {OuPositionSelectAlainModule} from '../ou-position/ou-user-select-alain/ou-position-select-alain.module';
import {OuUserSelectAlainModule} from '../ou-user/ou-user-select-alain/ou-user-select-alain.module';
import {OuOrgUserTreeSelectAlainModule} from "../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.module";


@NgModule({
    declarations: [OuOrgUserComponent],
    imports: [
        CommonModule,
        NzGridModule,
        NzCardModule,
        OuOrgUserRoutingModule,
        FormsModule,
        BaseGridModule,
        BasePopupModule,
        OuOrgUserTreeSelectPanelModule,
        OuOrgUserTreeSelectModule,
        OuPositionSelectAlainModule,
        NzButtonModule,
        NzIconModule,
        OuUserSelectAlainModule,
        OuOrgUserTreeSelectAlainModule,
        NzPopconfirmModule
    ]
})
export class OuOrgUserModule {
}
