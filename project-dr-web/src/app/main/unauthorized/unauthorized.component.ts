import {Component, OnInit} from '@angular/core';
import {MenuService} from "../service/menu.service";
import {Router} from "@angular/router";
import {MainService} from "../service/main.service";

@Component({
    selector: 'unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.less']
})
export class UnauthorizedComponent implements OnInit {

    constructor(
        private menuService: MenuService,
        private mainService: MainService,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    exit() {
        this.menuService.clearCache();
        this.mainService.logout().subscribe(() => {
            this.router.navigate(['login']);
        });
    }

}
