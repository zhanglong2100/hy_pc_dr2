import {Observable} from 'rxjs';
import {BaseNzTreeNodeOptions, Page, ReturnForm} from '../entity';
import {catchError} from 'rxjs/operators';
import {baseHandleError} from './base-http-service';
import {BaseService} from './base.service';
import {ComboBoxTreeNode} from '@sb/base/core/entity/combo-box-tree-node';
import {BaseTreeSearchConfig} from '@sb/base/core/entity/base-tree-search-config';

export abstract class BaseTreeService<F, S extends Page, T extends BaseNzTreeNodeOptions<F>> extends BaseService<F, S> {

    /**
     * 获取子节点
     * @param parentId 父节点标识
     * @param searchConfig 搜索对象
     * @param maxLevel 等级
     */
    getNzTree(parentId: string, searchConfig?: BaseTreeSearchConfig, maxLevel?: number): Observable<ReturnForm<T[]>> {
        return this._http.post<ReturnForm<T[]>>(`${this.url}/getNzTree`, Object.assign({}, searchConfig, {
            parentId: parentId,
            maxLevel: maxLevel,
        })).pipe(
            catchError(baseHandleError<ReturnForm<T[]>>('getNzTree'))
        );
    }

    /**
     * 搜索列表
     * @param text 搜索文本
     */
    searchByText(text: string): Observable<ReturnForm<T[]>> {
        return this._http.post<ReturnForm<T[]>>(`${this.url}/searchByText`, {
            text: text
        }).pipe(
            catchError(baseHandleError<ReturnForm<T[]>>('searchByText'))
        );
    }

    /**
     * 获取子节点
     * @param parentId 父节点标识
     * @param searchForm 搜索对象
     * @param maxLevel 等级
     */
    getComboBoxNzTree(parentId: string, searchForm?: BaseTreeSearchConfig, maxLevel?: number): Observable<ReturnForm<ComboBoxTreeNode[]>> {
        return this._http.post<ReturnForm<ComboBoxTreeNode[]>>(`${this.url}/getComboBoxNzTree`, Object.assign({}, searchForm, {
            parentId: parentId,
            maxLevel: maxLevel,
        })).pipe(
            catchError(baseHandleError<ReturnForm<ComboBoxTreeNode[]>>('getComboBoxNzTree'))
        );
    }

    /**
     * 搜索框
     * @param text 文本
     */
    searchComboBoxNzTree(text: string): Observable<ReturnForm<ComboBoxTreeNode[]>> {
        return this._http.post<ReturnForm<ComboBoxTreeNode[]>>(`${this.url}/searchComboBoxNzTree`, {
            text: text
        }).pipe(
            catchError(baseHandleError<ReturnForm<ComboBoxTreeNode[]>>('searchComboBoxNzTree'))
        );
    }

}
