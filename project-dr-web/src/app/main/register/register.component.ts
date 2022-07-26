import {AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MainService} from '../service/main.service';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, AfterViewInit {

    errorMessage = "";

    btnDisable: boolean = false;

    validateForm: FormGroup;

    _loginFor = null;

    submitForm(): void {
        for (const i in this.validateForm.controls) {
            this.validateForm.controls[i].markAsDirty();
            this.validateForm.controls[i].updateValueAndValidity();
        }
        const registerUser = this.validateForm.value;
        this.mainService.register(registerUser).subscribe(returnForm => {
            if (returnForm && returnForm.success) {
                this.router.navigate(['../login'], {
                    queryParams: {loginFor: this._loginFor},
                    relativeTo: this.activatedRoute
                });
                // if (this._loginFor) {
                //     this.router.navigate([this._loginFor]);
                // } else {
                //     this.router.navigate(['/']);
                // }
            } else {
                this.errorMessage = returnForm.errorMessage;
            }
        });
    }

    updateConfirmValidator(): void {
        /** wait for refresh value */
        Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return {required: true};
        } else if (control.value !== this.validateForm.controls.password.value) {
            return {confirm: true, error: true};
        }
        return {};
    };

    generateVerifyCode(event: Event): void {
        let tel = this.validateForm.get('tel').value;
        this.mainService.sendCaptcha(tel).subscribe((returnForm) => {
            if (returnForm.success) {
                this.btnDisable = true;
            }
        });
        event.preventDefault();
    }

    constructor(private fb: FormBuilder,
                private mainService: MainService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private el: ElementRef,
                private renderer2: Renderer2) {

        this.activatedRoute.queryParams.subscribe((params: Params) => {
            const loginFor: string = params['loginFor'];
            if (!loginFor) {
                this._loginFor = null;
            } else {
                this._loginFor = loginFor;
            }
        });
    }

    ngOnInit(): void {
        this.validateForm = this.fb.group({
            // email: [null, [Validators.email, Validators.required]],
            password: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required, this.confirmationValidator]],
            loginName: [null, [Validators.required]],
            phoneNumberPrefix: ['+86'],
            tel: [null, [Validators.required]],
            verifyCode: [null, [Validators.required]],
            agree: [false]
        });
    }

    ngAfterViewInit(): void {
        this.updateLoginHeaderPosition();
    }

    @HostListener('window:resize', [])
    updateLoginHeaderPosition() {
        let registerFormHeight = this.el.nativeElement.querySelector('.register-form').offsetHeight;
        this.renderer2.setStyle(this.el.nativeElement.querySelector('.login-header'), 'height', `calc(50% - ${registerFormHeight / 2}px)`);
    }
}
