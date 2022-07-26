import {Injectable} from '@angular/core';
import {SysCodeSearchForm} from '../entity/sys-code-search-form';
import {SysCode} from '../entity/sys-code';
import {SysCodeTreeNode} from '../entity/sys-code-tree-node';
import {BaseTreeService} from '@sb/base/core/service/base-tree.service';
import {Observable} from 'rxjs';
import {baseHandleError, ComboBox, ReturnForm} from '@sb/base';
import {ComboBoxTreeNode} from '@sb/base/core/entity/combo-box-tree-node';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

/**
 * 机构服务
 */
@Injectable({
    providedIn: 'root'
})
export class SysCodeService extends BaseTreeService<SysCode, SysCodeSearchForm, SysCodeTreeNode> {

    basePath = 'sys/code';

    // uploadUrl = `${this.url}/importCode`;

    downloadUrl = `${this.url}/export`;

    constructor(
        private http: HttpClient
    ) {
        super(http);
    }

    /**
     * 上传xlx
     */
    // importCode(entity: F): Observable<ReturnForm<F>> {
    //     return this._http.post<ReturnForm<F>>(`${this.url}/commit`, entity).pipe(
    //         catchError(baseHandleError<ReturnForm<F>>('post'))
    //     );
    // }

    /**
     * 获取子节点
     * @param moduleCode 父节点标识
     * @param parentCode 搜索对象
     */
    getCustomComboBoxNzTree(moduleCode: string, parentCode?: string): Observable<ReturnForm<ComboBoxTreeNode[]>> {
        return this.http.post<ReturnForm<ComboBoxTreeNode[]>>(`${this.url}/getComboBoxNzTree`, {
            moduleCode: moduleCode,
            parentCode: parentCode,
        }).pipe(
            catchError(baseHandleError<ReturnForm<ComboBoxTreeNode[]>>('getCustomComboBoxNzTree'))
        );
    }

    importCode(formData: FormData): Observable<ReturnForm<String>> {
        return this.http.post<ReturnForm<String>>(`${this.url}/importCode`, formData).pipe(
            catchError(baseHandleError<ReturnForm<String>>('importCode'))
        );
    }

    // upload2(formData: FormData): Observable<ReturnForm<PsAttachfile>> {
    //     return this.http.post<ReturnForm<PsAttachfile>>(`${this.url}/upload2`, formData).pipe(
    //         catchError(baseHandleError<ReturnForm<PsAttachfile>>('upload2'))
    //     );
    // }

    getByCodeAndModuleCode(moduleCode: string, code: string): Observable<ReturnForm<SysCode>> {
        return this.http.post<ReturnForm<SysCode>>(`${this.url}/getByCodeAndModuleCode`, {
            moduleCode: moduleCode,
            code: code,
        }).pipe(
            catchError(baseHandleError<ReturnForm<SysCode>>('getByCodeAndModuleCode'))
        );
    }

    getComboBox(moduleCode: string, parentCode?: string): Observable<ReturnForm<ComboBox[]>> {
        return this.http.post<ReturnForm<ComboBox[]>>(`${this.url}/comboBox`, {
            moduleCode: moduleCode,
            parentCode: parentCode,
        }).pipe(
            catchError(baseHandleError<ReturnForm<ComboBox[]>>('getComboBox'))
        );
    }
}
