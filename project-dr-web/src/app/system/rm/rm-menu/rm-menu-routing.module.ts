import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RmMenuComponent} from './rm-menu/rm-menu.component';


const routes: Routes = [
    {
        path: '', component: RmMenuComponent
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
export class RmMenuRoutingModule {
}
