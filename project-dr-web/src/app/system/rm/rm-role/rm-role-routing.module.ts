import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RmRoleComponent} from './rm-role/rm-role.component';


const routes: Routes = [
    {
        path: '', component: RmRoleComponent
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
export class RmRoleRoutingModule {
}
