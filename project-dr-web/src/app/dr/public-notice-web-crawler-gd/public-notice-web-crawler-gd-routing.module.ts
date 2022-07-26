import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicNoticeWebCrawlerGdComponent} from './public-notice-web-crawler-gd/public-notice-web-crawler-gd.component';


const routes: Routes = [{
    path: '', component: PublicNoticeWebCrawlerGdComponent
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PublicNoticeWebCrawlerGdRoutingModule {
}
