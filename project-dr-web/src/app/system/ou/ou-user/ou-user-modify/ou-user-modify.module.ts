import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OuUserModifyComponent} from "./ou-user-modify.component";
import {BaseDetailModule} from "@sb/base";
import {FormsModule} from "@angular/forms";


@NgModule({
    declarations: [OuUserModifyComponent],
    imports: [
        CommonModule,
        FormsModule,
        BaseDetailModule
    ],
    exports: [OuUserModifyComponent]
})
export class OuUserModifyModule {
}
