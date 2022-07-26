import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.router.navigate(['/login'], {
            queryParams: {loginFor: this.router.url},
            replaceUrl: false
        });
    }

}
