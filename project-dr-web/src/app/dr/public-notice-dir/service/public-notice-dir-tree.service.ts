import {Injectable} from '@angular/core';
import {PublicNoticeDirSearchForm} from '../entity/public-notice-dir-search-form';
import {HttpClient} from '@angular/common/http';
import {PublicNoticeDir} from '../entity/public-notice-dir';
import {PublicNoticeDirTreeNode} from '../entity/public-notice-dir-tree-node';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {baseHandleError, ReturnForm} from '@sb/base';

/**
 * 功能服务
 */
@Injectable({
    providedIn: 'root'
})
export class PublicNoticeDirTreeService extends BaseTreeService<PublicNoticeDir, PublicNoticeDirSearchForm, PublicNoticeDirTreeNode> {

    basePath = 'dataReceive/publicNoticeDir';
    uploadUrl = `${this.url}/upload`;
    downloadPath = `${this.url}/download`;

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    upload(formData: FormData): Observable<ReturnForm<string>> {
        return this.http.post<ReturnForm<string>>(`${this.url}/upload`, formData).pipe(
            catchError(baseHandleError<ReturnForm<string>>('upload'))
        );
    }

}
