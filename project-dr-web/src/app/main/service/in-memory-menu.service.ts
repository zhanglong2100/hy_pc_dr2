import {Injectable} from '@angular/core';
import {HttpRequest} from '@angular/common/http';
import {InMemoryConfig, InMemoryDbService, RequestInfo} from '@sb/in-memory-http-client';


@Injectable()
export class InMemoryMenuService extends InMemoryDbService {

    createDb(reqInfo?: RequestInfo) {

        const ssyhChildMenu = [
        ];

        const sjglChildMenu = [
            {
                code: 'dm-style',
                name: '样式管理',
                loadChildren: 'src/app/zhzs/dm/dm-style/dm-style.module#DmStyleModule'
            },
        ];

        const systemChildMenu = [
            {
                code: 'function',
                name: '功能管理',
                loadChildren: 'src/app/system/rm/rm-function/rm-function.module#RmFunctionModule'
            },
            {
                code: 'menu',
                name: '菜单管理',
                loadChildren: 'src/app/system/rm/rm-menu/rm-menu.module#RmMenuModule'
            },
            {
                code: 'role',
                name: '角色管理',
                loadChildren: 'src/app/system/rm/rm-role/rm-role.module#RmRoleModule'
            },
            {
                code: 'org',
                name: '机构部门',
                loadChildren: 'src/app/system/ou/ou-org/ou-org.module#OuOrgModule'
            },
            {
                code: 'org-user',
                name: '机构用户',
                loadChildren: 'src/app/system/ou/ou-org-user/ou-org-user.module#OuOrgUserModule'
            },
            {
                code: 'user2',
                name: '用户管理',
                loadChildren: 'src/app/system/ou/ou-user/ou-user.module#OuUserModule'
            },
            {
                code: 'position',
                name: '岗位管理',
                loadChildren: 'src/app/system/ou/ou-position/ou-position.module#OuPositionModule'
            },
            {
                code: 'permission',
                name: '权限管理',
                loadChildren: 'src/app/system/up/user-role/user-role.module#UserRoleModule'
            },
            {
                code: 'sys-code',
                name: '数据字典',
                loadChildren: 'src/app/system/sys/sys-code/sys-code.module#SysCodeModule'
            },
            {
                code: 'sys-param',
                name: '系统参数',
                loadChildren: 'src/app/system/sys/sys-param/sys-param.module#SysParamModule'
            },
            {
                code: 'app-version',
                name: 'app版本管理',
                loadChildren: 'src/app/app-version/app-version.module#AppVersionModule'
            },
            {
                code: 'sys-log',
                name: '系统日志',
                loadChildren: 'src/app/system/sys/sys-log/sys-log.module#SysLogModule'
            },
            {
                code: 'sys-error-log',
                name: '系统错误',
                loadChildren: 'src/app/system/sys/sys-error-log/sys-error-log.module#SysErrorLogModule'
            }
        ];

        const globalMenu = [
            {
                code: 'ssyh',
                name: '设施养护',
                children: ssyhChildMenu
            },
            {
                code: 'sjgl',
                name: '数据管理',
                children: sjglChildMenu
            },
            {
                code: 'sys',
                name: '系统管理',
                children: systemChildMenu
            }
        ];
        return {
            menu: globalMenu
        };
    }

    getDbKeys(): { [p: string]: string[] } {
        return {menu: ['code']};
    }


    support(request: HttpRequest<any>): boolean {
        const config: InMemoryConfig = this.config;
        return request.url.startsWith(config.rootPath + 'menu');
    }

    /**
     * 获取系统菜单
     */
    getShowMenu(): any {
        return this.db['menu'];
    }
}
