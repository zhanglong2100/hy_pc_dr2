import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserRoleComponent} from './user-role/user-role.component';


const routes: Routes = [
    {
        path: '', component: UserRoleComponent
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
export class UserRoleRoutingModule {
}
