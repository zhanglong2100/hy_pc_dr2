import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OuOrgRoutingModule} from './ou-org-routing.module';
import {OuOrgComponent} from './ou-org/ou-org.component';
import {BaseGridModule, BaseTreeModule} from '@sb/base';
import {NzButtonModule, NzCardModule, NzGridModule, NzIconModule} from 'ng-zorro-antd';
import {OuOrgUserTreeSelectAlainModule} from '../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.module';
import {OuOrgUserTreeSelectPanelModule} from '../ou-org-user-tree-select-panel/ou-org-user-tree-select-panel.module';


@NgModule({
    declarations: [
        OuOrgComponent
    ],
    imports: [
        CommonModule,
        OuOrgRoutingModule,
        BaseTreeModule,
        NzGridModule,
        BaseGridModule,
        NzButtonModule,
        NzIconModule,
        NzCardModule,
        OuOrgUserTreeSelectPanelModule,
        OuOrgUserTreeSelectAlainModule
    ]
})
export class OuOrgModule {
}
