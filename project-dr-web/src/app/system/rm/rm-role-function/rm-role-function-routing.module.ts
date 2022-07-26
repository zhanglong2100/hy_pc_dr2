import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RmRoleFunctionComponent} from "./rm-role-function/rm-role-function.component";


const routes: Routes = [
    {
        path: '', component: RmRoleFunctionComponent
    }
];


@NgModule({
    exports: [
        RouterModule
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class RmRoleFunctionRoutingModule {
}
