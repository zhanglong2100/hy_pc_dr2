import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule, NzTreeSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {CreateUserAndLoadComponent} from './create-user-and-load.component';
import {DelonFormModule} from '@delon/form';
import {OuOrgUserTreeSelectAlainModule} from '../../ou-org-user-tree-select-alain/ou-org-user-tree-select-alain.module';


@NgModule({
    declarations: [CreateUserAndLoadComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzTreeSelectModule,
        NzIconModule,
        DelonFormModule,
        OuOrgUserTreeSelectAlainModule
    ],
    exports: [CreateUserAndLoadComponent],
})
export class CreateUserAndLoadModule {
}
