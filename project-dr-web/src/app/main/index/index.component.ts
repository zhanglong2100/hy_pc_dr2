import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MainService} from '../service/main.service';
import {PlatformLocation} from '@angular/common';
import {TitleService} from '../service/title.service';
import {ShowMenu, ShowMenus} from "../entity/show-menu";

@Component({
    selector: 'sb-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit, AfterViewInit {

    public isHome = true;

    imgUrl = '';
    private data = false;

    menu: ShowMenus | ShowMenu;

    // 获取到该元素
    @ViewChild('logo', {read: ElementRef, static: true})
    logoDom: ElementRef;

    // 获取到该元素
    @ViewChild('indexHeader', {read: ElementRef, static: true})
    indexHeader: ElementRef;

    remainWidth = 0;

    contentHeight;

    constructor(private location: PlatformLocation,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                public titleService: TitleService,
                private mainService: MainService) {
    }

    // 判断如果是首页,则面包屑不显示
    checkUrl() {
        if (this.location.hash.includes('home')) {
            this.isHome = false;
        } else {
            this.isHome = true;
        }
    }

    ngOnInit() {
        this.imgUrl = './assets/images/logo.png';

        this.checkUrl();

        // 监听路由跳转
        this.router.events
            .subscribe((event) => {
                this.checkUrl();
            });

    }

    ngAfterViewInit(): void {
        this.updateRemainWidth();
    }


    @HostListener('window:resize', [])
    updateRemainWidth() {
        this.remainWidth = window.innerWidth - this.logoDom.nativeElement.offsetWidth - 25;
        this.contentHeight = `${window.innerHeight - this.indexHeader.nativeElement.offsetHeight}px`;
    }

    signOut(): void {
        this.mainService.logout().subscribe(() => {
            this.router.navigate(['login']);
        });

    }

    get showBreadcrumb() {
        return window.innerWidth > 600;
    }

    topMenuChange(menu: any) {
        this.menu = menu;
    }
}
