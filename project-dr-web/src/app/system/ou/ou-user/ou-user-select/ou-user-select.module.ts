import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OuUserSelectComponent} from './ou-user-select.component';
import {NzIconModule, NzSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [OuUserSelectComponent],
    imports: [
        CommonModule,
        NzSelectModule,
        FormsModule,
        NzIconModule
    ],
    exports: [OuUserSelectComponent]
})
export class OuUserSelectModule {
}
