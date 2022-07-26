import {Injectable} from '@angular/core';
import {JsTreeNode} from '../entity/js-tree-node';
import {JsNzTreeNode} from '../entity/js-nz-tree-node';

@Injectable({
    providedIn: 'root'
})
export class JsTreeNodeService {

    constructor() {
    }

    /**
     * 将树状结构 转换成treegrid 所要求的格式
     * @param data 数据节点
     */
    public changeToTreeGridData<T>(data: Array<JsTreeNode<T>>): Array<JsTreeNode<T>> {
        const arr: Array<JsTreeNode<T>> = [];
        for (const one of data) {
            arr.push(one);
        }
        let index = 0;
        while (arr.length > index) {
            const one: JsTreeNode<T> = arr[index++];
            if (one.state && one.state.opened) {
                one.expand = true;
            } else {
                one.expand = false;
            }
            if (one.parent) {
                one.level = one.parent.level + 1;
            } else {
                one.level = 0;
            }
            if (one.children instanceof Array) {
                const s = arr.indexOf(one);
                for (let i = 0; i < one.children.length; i++) {
                    const c = one.children[i];
                    c.parent = one;
                    arr.splice(s + i + 1, 0, c);
                }
            } else {
                if (one.children === true) {
                    one.children = [];
                    one.noLoadedChildren = true;
                } else {
                    one.children = [];
                }
            }
        }
        return arr;
    }

    /**
     * 将数据转换成NzTreeNode节点
     * @param data jsTreeNode节点
     */
    public changeToNgTreeNode<T>(data: Array<JsTreeNode<T>>): Array<JsNzTreeNode<T>> {
        return this._change(data);
    }

    private _change<T>(data: Array<JsTreeNode<T>>): Array<JsNzTreeNode<T>> {
        const arr: Array<JsNzTreeNode<T>> = [];
        for (const one of data) {
            const nzOne: JsNzTreeNode<T> = new JsNzTreeNode<T>({
                key: one.id,
                title: one.text,
                checked: one.state.checked,
                selected: one.state.selected,
                disabled: one.state.disabled,
                expanded: one.state.opened,
                data: one.data,
                // isLeaf?: boolean;
                // selectable?: boolean;
                // disableCheckbox?: boolean;
                // expanded?: boolean;
                // [key: string]: any;
            });

            if (one.children instanceof Array) {
                nzOne.children = this._change(one.children);
            }
            arr.push(nzOne);
        }
        return arr;
    }
}
