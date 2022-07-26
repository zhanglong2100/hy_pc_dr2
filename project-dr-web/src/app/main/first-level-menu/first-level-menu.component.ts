import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    QueryList,
    Renderer2,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import {MainService} from '../service/main.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {PlatformLocation} from '@angular/common';
import {ShowMenu, ShowMenus} from '../entity/show-menu';
import {BaseService, ReturnForm} from '@sb/base';
import {MenuService} from '../service/menu.service';
import {OuUser} from '../../system/ou/ou-user/entity/ou-user';
import {OuUserService} from '../../system/ou/ou-user/ou-user.service';
import {SessionUser} from '../entity/session-user';
import {OuOrgUser} from '../../system/ou/ou-org-user/entity/ou-org-user';
import {OuOrgUserService} from '../../system/ou/ou-org-user/service/ou-org-user.service';
import {NzMessageService, NzNotificationService} from 'ng-zorro-antd';
import {TitleService} from '../service/title.service';

@Component({
    selector: 'sb-first-level-menu',
    templateUrl: './first-level-menu.component.html',
    styleUrls: ['./first-level-menu.component.less'],
    providers: [
        {
            provide: BaseService,
            useClass: OuUserService
        }
    ]
})
export class FirstLevelMenuComponent implements OnInit, AfterViewInit {

    /**
     * 点击顶层菜单
     */
    @Output() topMenuChange = new EventEmitter<ShowMenus | ShowMenu>();

    /**
     * 当前层菜单
     */
    _menus: ShowMenus = [];

    set menus(menus: ShowMenus) {
        this._menus = menus;
        this.subMenus = menus;
        this.updateMoreMenus();
    }

    get menus(): ShowMenus {
        return this._menus;
    }

    /**
     * 当前层子菜单（右边弹出的）
     */
    subMenus: ShowMenus = [];

    showBack = true;

    showWorkMsg = false;

    showWarnMsg = false;

    // 获取到该元素
    @ViewChildren('menu2', {read: ElementRef})
    menuDoms: QueryList<ElementRef>;

    private _maxWidth: number;

    get maxWidth(): number {
        return this._maxWidth;
    }

    @Input()
    set maxWidth(value: number) {
        this._maxWidth = value;
        if(this._maxWidth > 0){
            this.updateMenuWidth();
        }
    }

    // 定义class的绑定变量
    subMenusColor2 = false;

    settingsColor2 = false;

    record: OuUser;

    sessionUser: SessionUser;

    showModifyUser = false;

    showModifyPassword = false;

    showModifyList = true;

    depts: OuOrgUser[] = [];

    notReadWorkMsg = 0;

    notReadWarnMsg = 0;

    @ViewChild('tip', {static: false}) template: TemplateRef<{}>;

    constructor(
        private location: PlatformLocation,
        private router: Router,
        private elementRef: ElementRef,
        private renderer2: Renderer2,
        private mainService: MainService,
        private menuService: MenuService,
        private activatedRoute: ActivatedRoute,
        private orgUserService: OuOrgUserService,
        protected message: NzMessageService,
        private titleService: TitleService,
        private notification: NzNotificationService,
    ) {
        const navEnd = this.router.events.pipe(
            filter(evt => evt instanceof NavigationEnd)
        ) as Observable<NavigationEnd>;
        navEnd.subscribe((evt) => {
            this.updateSubTitle(evt.urlAfterRedirects);
            this.update(evt.urlAfterRedirects);
        });
    }

    openMenu(menu: ShowMenu) {
        window.open(`${window.location.protocol}//${window.location.host}/#/${menu.code}`);
    }

    private updateSubTitle(url) {
        const systemCode = url.split('/')[2];
        this.titleService.subTitle = this.getSubTitle(systemCode, this.activatedRoute.root);
    }

    private getSubTitle(systemCode, route: ActivatedRoute) {
        const children = route.children;
        if (children && children.length > 0) {
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (child.routeConfig.data && child.routeConfig.data.breadcrumb) {
                    if (child.routeConfig.path === systemCode) {
                        return child.routeConfig.data.breadcrumb;
                    }
                }
                return this.getSubTitle(systemCode, child);
            }
        }
    }

    private update(url) {
        for (const menu of this.menus) {
            if (url === menu.routerLink) {
                this.topMenuChange.emit(menu);
            } else if (menu.children) {
                for (const menu2 of menu.children) {
                    if (url.startsWith(menu2.routerLink) || (url + '/' === menu2.routerLink)) {
                        this.topMenuChange.emit(menu.children);
                    }
                }
            }
        }
    }

    ngOnInit() {
        this.menuService.getShowMenu().pipe(
            map((returnForm) => {

                this.showBack = returnForm.message.length > 1;

                let curUrl = this.router.url;
                let noContent = true;
                for (let i = 0; i < returnForm.message.length; i++) {
                    const menu = returnForm.message[i];
                    if (curUrl.indexOf('/' + menu.code) !== -1) {
                        returnForm.message = menu.children;
                        noContent = false;
                        break;
                    }
                }
                if (noContent) {
                    returnForm.message = [];
                }
                let index = 0;
                let count = 0;
                while (count < 3) {
                    index = curUrl.indexOf('/', index) + 1;
                    count++;
                }
                curUrl = curUrl.substring(0, index - 1);
                this.menuService.updateMenus(returnForm.message, curUrl);
                return returnForm;
            })
        ).subscribe((returnForm: ReturnForm<ShowMenus>) => {
            if (returnForm.success) {
                this.menus = returnForm.message;
                this.update(this.router.url);
            }
        });

        const sessionUserStr = window.localStorage.getItem('sessionUser');
        if (sessionUserStr) {
            this.sessionUser = JSON.parse(sessionUserStr);
            this.record = this.sessionUser as OuUser;
        }
    }

    // 退出系统
    signOut(): void {
        this.menuService.clearCache();
        this.mainService.logout().subscribe(() => {
            this.router.navigate(['login']);
        });
    }

    // 屏幕宽度改变的时候
    @HostListener('window:resize', [])
    updateMoreMenus(): void {
        if (this.menus.length === this.subMenus.length) {
            this.updateMenuWidth();
        } else {
            this._menus = this.subMenus.slice(0, this.subMenus.length);
        }
    }

    ngAfterViewInit(): void {
        this.menuDoms.changes.subscribe(
            () => {
                if (this.menus.length === this.subMenus.length) {
                    this.updateMenuWidth();
                }
            }
        );
    }

    updateMenuWidth() {
        let width = this._maxWidth - 230;
        let flag = true;
        if (this.menuDoms) {
            this.menuDoms.forEach((element: ElementRef, index, array) => {

                if (flag) {
                    if (width < element.nativeElement.offsetWidth + 14) {
                        this._menus = this.menus.slice(0, index);
                        flag = false;
                    } else {
                        width -= element.nativeElement.offsetWidth + 14;
                    }
                }
            });
        }
    }

    backToParent() {
        this.router.navigate(['../'], {relativeTo: this.activatedRoute});
    }

    changeDeptClick(evt: Event) {
        this.showModifyList = false;
        this.orgUserService.getCurrentUserDepts().subscribe(
            res => {
                this.depts = [];
                if (res.success) {
                    this.depts = res.message;
                }
            }
        );
        this.settingsColor2 = true;
        evt.stopPropagation();
    }

    changeDept(deptId) {
        if (deptId !== this.sessionUser.mainDeptId) {
            this.mainService.changeDept(deptId).subscribe(
                res => {
                    if (res.success) {
                        this.message.success('部门切换成功！');
                        this.router.navigateByUrl('/nav');
                    } else {
                        this.message.error('部门切换错误：' + res.errorMessage);
                    }
                }
            );
        }
    }

    visibleChange(value: boolean) {
        if (value) {
            this.showModifyList = true;
        }
    }

    clickWarn(evt) {
        this.showWarnMsg = true;
    }

}
