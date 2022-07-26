import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AgencySupermarketComponent} from './agency-supermarket/agency-supermarket.component';


const routes: Routes = [{
    path: '', component: AgencySupermarketComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AgencySupermarketRoutingModule {
}
