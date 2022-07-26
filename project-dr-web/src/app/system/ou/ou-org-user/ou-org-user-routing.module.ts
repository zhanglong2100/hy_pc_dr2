import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OuOrgUserComponent} from './ou-org-user/ou-org-user.component';


const routes: Routes = [{
    path: '',
    component: OuOrgUserComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OuOrgUserRoutingModule {
}
