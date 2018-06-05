import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UUID } from 'angular2-uuid';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {

    isFail = false;
    isSuccess = false;
    isLoad = false;
    username;
    isAuthorized;
    isAuthenticated;
    GUID;

    constructor(public router: Router, private http: HttpClient) {
    }
    ngOnInit() {
        sessionStorage.setItem('isLoggedin', 'false');
        // console.log(sessionStorage.getItem('isLoggedin'));
    }

    onSubmit(form: NgForm) {
        this.isFail = false;
        this.isSuccess = false;

        this.isLoad = true;


        const headers = new HttpHeaders({ 'Content-Type': 'application/xml' }).set('Accept', 'text/xml');
        // tslint:disable:max-line-length
        const body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="com/Schemas/UserWrapperPayload/V1"><soapenv:Header/><soapenv:Body><v1:ValidationRequest><v1:username>' + form.value.user + '</v1:username><v1:password>' + form.value.pass + '</v1:password><v1:application>TDDBuilder</v1:application><v1:subapplication>TDDBuilder</v1:subapplication></v1:ValidationRequest></soapenv:Body></soapenv:Envelope>';
        this.http.post('http://tst-ibs.corporate.ge.com/UserAuthenticationService/ValidateUser', body, { responseType: 'text' }).subscribe

            (data => {
                this.isLoad = false;

                console.log('success', data);
                const loc = data.indexOf('<ns1:isAuthenticated>') + 21;
                const endloc = data.indexOf('</ns1:isAuthenticated>');
                const str = data.substring(loc, endloc);
                // console.log(str);
                const loc2 = data.indexOf('<ns1:UserName>') + 14;
                const endloc2 = data.indexOf('</ns1:UserName>');
                const str2 = data.substring(loc2, endloc2);

                const loc3 = data.indexOf('<ns1:isAuthorized>') + 18;
                const endloc3 = data.indexOf('</ns1:isAuthorized>');
                const str3 = data.substring(loc3, endloc3);

                sessionStorage.setItem('isAuthorized', str3);
                sessionStorage.setItem('isAuthenticated', str);
               // console.log(str);
                //console.log(str2);
                //console.log(str3);

                
                let uuid = UUID.UUID();
                sessionStorage.setItem('GUID', uuid);
                console.log(sessionStorage.getItem('GUID'));

                // console.log(str2);
                // Store
                sessionStorage.setItem('username', str2);
                // console.log(sessionStorage.getItem("username"));
            if (str === 'true' /*&& str3 === 'true'*/) {
                    sessionStorage.setItem('isLoggedin', 'true');
                    this.isSuccess = true;
                    this.router.navigate(['/dashboard']);
                } else {
                    sessionStorage.setItem('isLoggedin', 'false');
                    this.isLoad = false;
                    this.isFail = true;
                }
            },
            err => {
                this.isLoad = false;

                console.log('error', err);
                alert(err.error);
                alert('Network issue. Please ensure you are connected to GE VPN or the network is working properly.');
            }
            );

            this.loginToDB();
    }
    loginToDB() {
        this.username = sessionStorage.getItem('username');
        this.isAuthenticated = sessionStorage.getItem('isAuthenticated');
        this.isAuthorized = sessionStorage.getItem('isAuthorized');
        this.GUID = sessionStorage.getItem('GUID');
        const body2 = ' <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ins="http://xmlns.oracle.com/pcbpel/adapter/db/insertLog"><soapenv:Header/><soapenv:Body><ins:insertLogInput><ins:GUID>' + this.GUID + '</ins:GUID><ins:UserName>' + this.username + '</ins:UserName> <ins:Application>DocumentationAutoGenerator</ins:Application> <ins:IsAuthorized>' + this.isAuthorized + '</ins:IsAuthorized><ins:IsAuthenticate>' + this.isAuthenticated + '</ins:IsAuthenticate><ins:Description></ins:Description><ins:User_Operation></ins:User_Operation></ins:insertLogInput></soapenv:Body></soapenv:Envelope>';
        this.http.post('http://stg-ibs.corporate.ge.com/UserAuthenticationProject/Services/ProxyService/EntryLogWrapper', body2, { responseType: 'text' }).subscribe
        (data => {
            //console.log('Login to DB', data);
        },
        err => {
            console.log( err);
        }
    );
    }

    onLoggedin(form: NgForm) {
        console.log(form.value.user, form.value.pass);
        sessionStorage.setItem('isLoggedin', 'true');
    }
}
