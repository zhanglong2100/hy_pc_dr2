import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MainService} from '../service/main.service';
import {Router} from '@angular/router';
import {ReturnForm} from '@sb/base';
import {LoginUser} from '../entity/login-user';

@Component({
    selector: 'sb-create-admin',
    templateUrl: './create-admin.component.html',
    styleUrls: ['./create-admin.component.less']
})
export class CreateAdminComponent implements OnInit {

    errorMessage = '';
    user: LoginUser = {
        userName: 'admin',
        password: ''
    };

    validateForm: FormGroup;

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
    }

    constructor(private fb: FormBuilder,
                private mainService: MainService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            password: [null, [Validators.required]]
        });
    }

    doLogin() {
        if (this.validateForm.valid) {
            this.mainService.createAdmin(this.user).subscribe((returnForm: ReturnForm<string>) => {
                if (returnForm.success) {
                    this.router.navigate(['/login', {outlets: {popup: null}, queryParams: {system: 'true'}}]);
                } else {
                    this.errorMessage = returnForm.message;
                }
            });
        }
    }

}
