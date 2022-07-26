import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuPasswordModifyComponent} from "./ou-password-modify.component";
import {BaseDetailModule} from "@sb/base";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [OuPasswordModifyComponent],
    imports: [
        CommonModule,
        FormsModule,
        BaseDetailModule
    ],
    exports: [OuPasswordModifyComponent]
})
export class OuPasswordModifyModule {
}
