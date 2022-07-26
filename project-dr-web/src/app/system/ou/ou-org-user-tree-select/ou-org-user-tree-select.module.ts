import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuOrgUserTreeSelectComponent} from './ou-org-user-tree-select.component';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [OuOrgUserTreeSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule
    ],
    exports: [OuOrgUserTreeSelectComponent],
})
export class OuOrgUserTreeSelectModule {
}
