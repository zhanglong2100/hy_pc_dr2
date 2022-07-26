import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OuUserComponent} from './ou-user/ou-user.component';


const routes: Routes = [{
    path: '',
    component: OuUserComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OuUserRoutingModule {
}
