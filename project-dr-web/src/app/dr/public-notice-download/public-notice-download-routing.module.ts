import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicNoticeDownloadComponent} from './public-notice-download/public-notice-download.component';


const routes: Routes = [{
    path: '', component: PublicNoticeDownloadComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicNoticeDownloadRoutingModule {
}
