import {AfterViewInit, Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {ShowMenus} from '../entity/show-menu';
import {ActivatedRoute, Router} from '@angular/router';
import {MenuService} from '../service/menu.service';
import {ReturnForm} from '@sb/base';
import {NzMessageService} from 'ng-zorro-antd';
import {MainService} from "../service/main.service";

@Component({
    selector: 'sb-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.less']
})
export class NavigationComponent implements OnInit, AfterViewInit {

    showMenus1: ShowMenus = [];

    showMenus2: ShowMenus = [];

    constructor(
        private el: ElementRef,
        private renderer2: Renderer2,
        private menuService: MenuService,
        private activatedRoute: ActivatedRoute,
        private nzMessageService: NzMessageService,
        private mainService: MainService,
        private router: Router) {
    }

    ngOnInit(): void {
        this.menuService.getShowMenu().subscribe((returnForm: ReturnForm<ShowMenus>) => {
            if (returnForm.success) {
                let showMenus = returnForm.message;

                if (showMenus.length === 0) {
                    this.router.navigate(['/unauthorized']);
                }

                this.showMenus1 = showMenus.slice(0, 3);

                this.showMenus2 = showMenus.slice(3, 6);

                if (showMenus.length === 1) {
                    this.router.navigate(['/index/' + showMenus[0].code]);
                }

            } else {
                this.nzMessageService.error("菜单加载错误");
            }
        });
    }

    ngAfterViewInit(): void {

    }

    exit() {
        this.menuService.clearCache();
        this.mainService.logout().subscribe(() => {
            this.router.navigate(['login']);
        });
    }

}
