import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OuOrgComponent} from './ou-org/ou-org.component';


const routes: Routes = [{
    path: '',
    component: OuOrgComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OuOrgRoutingModule {
}
