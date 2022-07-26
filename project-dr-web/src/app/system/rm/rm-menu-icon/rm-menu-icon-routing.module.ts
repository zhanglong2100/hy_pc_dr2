import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RmMenuIconComponent} from "./rm-menu-icon/rm-menu-icon.component";


const routes: Routes = [
    {
        path: '', component: RmMenuIconComponent
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
export class RmMenuIconRoutingModule {
}
