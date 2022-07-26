import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class AppRoutingStrategy extends RouteReuseStrategy {
    private waitDelete: string;
    public storedRoutes: Map<string, DetachedRouteHandle> = new Map<string, DetachedRouteHandle>();

    // 离开路由时触发，是否缓存即将被丢弃的组件
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return true;
    }

    // 离开路由时触发，缓存即将被丢弃的组件
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        if (this.waitDelete && this.waitDelete === this.getRouteUrl(route)) {
            // 如果待删除是当前路由则不存储快照
            this.waitDelete = null;
            return;
        }
        this.storedRoutes.set(this.getRouteUrl(route), handle);
    }

    // 进入路由时触发，是否允许还原路由
    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!this.storedRoutes.get(this.getRouteUrl(route));
    }

    // 进入路由时触发，还原路由
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig) {
            return null;
        }
        return this.storedRoutes.get(this.getRouteUrl(route));
    }

    // 进入路由时触发，是否同一路由时复用路由
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const result: boolean = future.routeConfig === curr.routeConfig;
        return result;
    }

    // 拿到当前路由路径 =》关键
    private getRouteUrl(route: ActivatedRouteSnapshot) {
        return route['_routerState'].url;
    }

    // 删除快照
    public deleteRouteSnapshot(name: string): void {
        if (this.storedRoutes.get(name)) {
            this.storedRoutes.delete(name);
        } else {
            this.waitDelete = name;
        }
    }
}
