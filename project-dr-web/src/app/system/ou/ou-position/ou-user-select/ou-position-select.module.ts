import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OuPositionSelectComponent} from './ou-position-select.component';
import {NzIconModule, NzSelectModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';


@NgModule({
    declarations: [OuPositionSelectComponent],
    imports: [
        CommonModule,
        NzSelectModule,
        FormsModule,
        NzIconModule
    ],
    exports: [OuPositionSelectComponent]
})
export class OuPositionSelectModule {
}
