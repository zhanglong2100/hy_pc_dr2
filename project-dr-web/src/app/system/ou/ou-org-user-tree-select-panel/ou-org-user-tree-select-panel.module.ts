import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuOrgUserTreeSelectPanelComponent} from './ou-org-user-tree-select-panel.component';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {BaseTreeModule} from '@sb/base';


@NgModule({
    declarations: [OuOrgUserTreeSelectPanelComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule,
        BaseTreeModule
    ],
    exports: [OuOrgUserTreeSelectPanelComponent],
})
export class OuOrgUserTreeSelectPanelModule {
}
