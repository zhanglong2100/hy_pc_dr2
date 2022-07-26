import {ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {BaseSelect2Component} from '@sb/base/select/base-select2.component';
import {OuUserSearchForm} from '../entity/ou-user-search-form';
import {OuUserService} from '../ou-user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {ComboBox} from '@sb/base';


@Component({
    selector: 'ou-user-select',
    templateUrl: './ou-user-select.component.html',
    styleUrls: ['./ou-user-select.component.less'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => OuUserSelectComponent),
            multi: true
        }
    ]
})
export class OuUserSelectComponent extends BaseSelect2Component<OuUserSearchForm> implements OnInit {

    isLoading = true;

    searchChange$ = new BehaviorSubject('');

    @Input()
    notShow?: string[];

    constructor(
        protected message: NzMessageService,
        protected ouUserService: OuUserService,
        @Inject(ChangeDetectorRef) public readonly cd: ChangeDetectorRef) {
        super(message, ouUserService, cd);
    }

    ngOnInit() {
        super.ngOnInit();

        // tslint:disable:no-any
        const optionList$: Observable<ComboBox[]> = this.searchChange$
            .asObservable()
            .pipe(debounceTime(200))
            .pipe(switchMap((name: string) => {
                    this.searchForm.searchText = name;
                    return this.ouUserService.comboBox(this.searchForm)
                        .pipe(map(r => r.message));
                }
                )
            );
        optionList$.subscribe(data => {
            if (this.notShow && this.notShow.length != 0) {
                this.propertyValues = data.filter(value => {
                    let show = true;
                    for (let i = 0; i < this.notShow.length; i++) {
                        if (this.notShow[i] === value.code) {
                            show = false;
                            break;
                        }
                    }
                    return show;
                });
            } else {
                this.propertyValues = data;
            }
            this.isLoading = false;
            this.cd.detectChanges();
        });
    }

    doInit() {
        this._initSelectOnInit = false;
    }

    onSearch(value: string): void {
        this.isLoading = true;
        this.searchChange$.next(value);
    }

}
