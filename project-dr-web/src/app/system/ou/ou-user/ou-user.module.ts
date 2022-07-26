import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserComponent} from './ou-user/ou-user.component';
import {BaseGridModule} from '@sb/base';
import {OuUserRoutingModule} from './ou-user-routing.module';
import {
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzPopconfirmModule
} from 'ng-zorro-antd';
import {OuOrgUserTreeSelectPanelModule} from '../ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.module';
import {OuOrgUserTreeSelectModule} from '../ou-org-user-tree-select/ou-org-user-tree-select.module';
import {FormsModule} from '@angular/forms';
import {OuUserSelectLineModule} from "./ou-user-select-line/ou-user-select-line.module";
import {OuUserSelectAlainModule} from "./ou-user-select-alain/ou-user-select-alain.module";
import {OuPositionSelectAlainModule} from "../ou-position/ou-user-select-alain/ou-position-select-alain.module";
import {OuOrgUserTreeSelectAlainModule} from "../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.module";


@NgModule({
    declarations: [OuUserComponent],
    imports: [
        CommonModule,
        OuUserRoutingModule,
        BaseGridModule,
        NzCardModule,
        NzGridModule,
        OuOrgUserTreeSelectPanelModule,
        OuOrgUserTreeSelectModule,
        FormsModule,
        NzPopconfirmModule,
        NzButtonModule,
        NzIconModule,
        OuUserSelectLineModule,
        OuUserSelectAlainModule,
        NzInputModule,
        OuPositionSelectAlainModule,
        OuOrgUserTreeSelectModule,
        OuOrgUserTreeSelectAlainModule

    ]
})
export class OuUserModule {
}
