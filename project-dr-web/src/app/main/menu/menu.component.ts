import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ShowMenu, ShowMenus} from "../entity/show-menu";
import {Router} from "@angular/router";

@Component({
    selector: 'sb-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

    @ViewChild('ccc', {static: true}) ccc: any;

    _menu: ShowMenus | ShowMenu;

    activeRouter: string = '';

    @Input() height;

    showSecond: boolean = false;

    @Input()
    set menu(menu: ShowMenus | ShowMenu) {
        if (!menu) {
            return;
        }
        this.showSecond = Array.isArray(menu);
        this._menu = menu;
    }

    get menu() {
        return this._menu;
    }

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    ngOnChanges() {
        const routerUrl = this.router.url
        this.activeRouter = routerUrl;
    }

    openMenu(menu: ShowMenu) {
        window.open(`${window.location.protocol}//${window.location.host}/#/${menu.code}`);
    }

}
