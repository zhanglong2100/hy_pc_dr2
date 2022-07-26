import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

interface IBreadcrumb {
    label: string;
    params?: Params;
    queryParams?: Params;
    url: string;
}

@Component({
    selector: 'sb-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.less']
})
export class BreadcrumbComponent implements OnInit {
    public breadcrumbs: IBreadcrumb[] = [];

    constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        // subscribe to the NavigationEnd event
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(event => {
            this.breadcrumbs = this.getBreadcrumbs2(this.activatedRoute.root);
        });
        this.breadcrumbs = this.getBreadcrumbs2(this.activatedRoute.root);
    }


    private getBreadcrumbs2(root: ActivatedRoute): IBreadcrumb[] {
        const breadcrumbs = this.getBreadcrumbs(root);

        if (breadcrumbs != null && breadcrumbs.length > 0) {
            breadcrumbs[breadcrumbs.length - 1].queryParams = root.snapshot.queryParams;
        }
        return breadcrumbs;
    }

    private getBreadcrumbs(
        route: ActivatedRoute,
        url: string = '',
        breadcrumbs: IBreadcrumb[] = []
    ): IBreadcrumb[] {
        const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

        // get the child routes
        const children: ActivatedRoute[] = route.children;

        // return if there are no more children
        if (children.length === 0) {
            return breadcrumbs;
        }

        // iterate over each children
        for (const child of children) {
            // verify primary route
            if (child.outlet !== PRIMARY_OUTLET) {
                continue;
            }

            // get the route's URL segment
            const routeURL: string = child.snapshot.url
                .map(segment => segment.path)
                .join('/');

            // append route URL to URL
            url += `/${routeURL}`;

            // verify the custom data property "breadcrumb" is specified on the route
            if (!(child.routeConfig.data && child.routeConfig.data[ROUTE_DATA_BREADCRUMB])) {
                return this.getBreadcrumbs(child, url, breadcrumbs);
            }

            // add breadcrumb
            const breadcrumb: IBreadcrumb = {
                label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
                params: child.snapshot.params,
                url: url,
            };
            breadcrumbs.push(breadcrumb);

            // recursive
            return this.getBreadcrumbs(child, url, breadcrumbs);
        }

        // we should never get here, but just in case
        return breadcrumbs;
    }

}
