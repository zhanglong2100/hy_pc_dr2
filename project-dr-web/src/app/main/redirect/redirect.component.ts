import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {PlatformLocation} from '@angular/common';

@Component({
    selector: 'redirect',
    templateUrl: './redirect.component.html',
    styleUrls: ['./redirect.component.less']
})
export class RedirectComponent implements OnInit {

    url: SafeResourceUrl;

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: PlatformLocation,
        private sanitizer: DomSanitizer
    ) {
    }

    ngOnInit() {
        let url = this.activatedRoute.snapshot.data['link'];
        if (!url.startsWith('http')) {
            if (url.startsWith('/')) {
                url = location.pathname + url;
            } else {
                url = location.protocol + '://' + url;
            }
        }
        url = url.startsWith('http') ? url : `http://${url}`;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

}
