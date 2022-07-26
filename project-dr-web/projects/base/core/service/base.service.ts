import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ComboBox, Page, ReturnForm, ReturnPage} from '../entity';
import {catchError} from 'rxjs/operators';
import {baseHandleError} from './base-http-service';
import {environment} from '../../../../src/environments/environment';

export abstract class BaseService<F, S extends Page> {
    readonly abstract basePath;

    baseServerUrl = '';

    get url() {
        if (this.baseServerUrl) {
            return `${this.baseServerUrl}${this.basePath}`;
        } else {
            return `${environment.baseServerUrl}${this.basePath}`;
        }
    }

    constructor(
        protected _http: HttpClient
    ) {
    }

    /**
     * 分页
     * @param searchForm
     */
    listWithPage(searchForm: S): Observable<ReturnForm<ReturnPage<F>>> {
        return this._http.post<ReturnForm<ReturnPage<F>>>(`${this.url}/list`, searchForm).pipe(
            catchError(baseHandleError<ReturnForm<ReturnPage<F>>>('post'))
        );
    }

    /**
     * 列表数据
     * @param searchForm
     */
    list(searchForm: S): Observable<ReturnForm<F[]>> {
        return this._http.post<ReturnForm<F[]>>(`${this.url}/list`, searchForm).pipe(
            catchError(baseHandleError<ReturnForm<F[]>>('post'))
        );
    }

    /**
     * 按标识获取
     * @param id
     */
    get(id: string): Observable<ReturnForm<F>> {
        return this._http.post<ReturnForm<F>>(`${this.url}/get`, {id: id}).pipe(
            catchError(baseHandleError<ReturnForm<F>>('post'))
        );
    }

    /**
     * 提交
     * @param entity
     */
    commit(entity: F): Observable<ReturnForm<F>> {
        return this._http.post<ReturnForm<F>>(`${this.url}/commit`, entity).pipe(
            catchError(baseHandleError<ReturnForm<F>>('post'))
        );
    }

    /**
     * 删除
     * @param ids
     */
    remove(ids: string[]): Observable<ReturnForm<string>> {
        return this._http.post<ReturnForm<string>>(`${this.url}/remove`, {['keyIds']: ids}).pipe(
            catchError(baseHandleError<ReturnForm<string>>('post'))
        );
    }

    /**
     * 获取comboBox
     * @param searchForm
     */
    comboBox(searchForm: S): Observable<ReturnForm<ComboBox[]>> {
        return this._http.post<ReturnForm<ComboBox[]>>(`${this.url}/comboBox`, searchForm).pipe(
            catchError(baseHandleError<ReturnForm<ComboBox[]>>('post'))
        );
    }

    /**
     * 排序
     * @param keyIds
     * @param baseParam
     */
    updateOrder(keyIds: string[], baseParam: object = {}): Observable<ReturnForm<string>> {
        if (!baseParam) {
            baseParam = {};
        }
        return this._http.post<ReturnForm<string>>(`${this.url}/updateOrder`, Object.assign({
            keyIds: keyIds
        }, baseParam)).pipe(
            catchError(baseHandleError<ReturnForm<string>>('post'))
        );
    }

    /**
     * 新增树型结构的拖动功能
     * @param dragId 拖动节点
     * @param targetId 目标节点
     * @param position 排序
     */
    drag(dragId: string, targetId: string, position: number): Observable<ReturnForm<string>> {
        return this._http.post<ReturnForm<string>>(`${this.url}/drag`, {
            dragId: dragId,
            targetId: targetId,
            position: position,
        }).pipe(
            catchError(baseHandleError<ReturnForm<string>>('drag'))
        );
    }
}
