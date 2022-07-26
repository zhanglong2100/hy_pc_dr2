import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RmMenuIconSelectComponent} from './rm-menu-icon-select.component';
import {NzButtonModule, NzIconModule, NzInputModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {BasePopupModule} from "@sb/base";


@NgModule({
    declarations: [RmMenuIconSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NzInputModule,
        NzButtonModule,
        NzIconModule,
        BasePopupModule,
    ],
    exports: [RmMenuIconSelectComponent],
})
export class RmMenuIconSelectModule {
}
