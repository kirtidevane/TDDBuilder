import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable, Subscription } from 'rxjs/Rx';
import { NgForm } from '@angular/forms';
import { ResponseContentType } from '@angular/http';
import { User } from '../blank-page/user.model';



import 'rxjs/add/observable/interval';
import { HttpserviceService } from './httpservice.service';

// tslint:disable:max-line-length

@Component({
    selector: 'app-blank-page',
    templateUrl: './blank-page.component.html',
    styleUrls: ['./blank-page.component.scss']
    
})
export class BlankPageComponent implements OnInit {
     
    user1 = new User();

    val = 0;
    isFail = false;
    isSuccess = false;
    buildText = '';
    username;
    isAuthorized;
    isAuthenticated;
    GUID;

    constructor(private http: HttpClient, private service: HttpserviceService, private httpold: Http) { }
    ngOnInit() {

        const downloadUrl = 'blank';
        // this.val = 70;
        //console.log(this.val);
        //console.log(this.isFail);
        this.username = sessionStorage.getItem('username');
        this.isAuthenticated = sessionStorage.getItem('isAuthenticated');
        this.isAuthorized = sessionStorage.getItem('isAuthorized');
        this.GUID = sessionStorage.getItem('GUID');
        //console.log(this.username);
        //console.log(this.isAuthenticated);
        //console.log(this.isAuthorized);
    
        //console.log(this.GUID);


    }

    sendToDB() {


        const body2 = ' <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ins="http://xmlns.oracle.com/pcbpel/adapter/db/insertLog"><soapenv:Header/><soapenv:Body><ins:insertLogInput><ins:GUID>' + this.GUID + '</ins:GUID><ins:UserName>' + this.username + '</ins:UserName> <ins:Application>DocumentationAutoGenerator</ins:Application> <ins:IsAuthorized>' + this.isAuthorized + '</ins:IsAuthorized><ins:IsAuthenticate>' + this.isAuthenticated + '</ins:IsAuthenticate><ins:Description>TDDGenerator</ins:Description><ins:User_Operation>TDDGenerator</ins:User_Operation></ins:insertLogInput></soapenv:Body></soapenv:Envelope>';
        this.http.post('http://stg-ibs.corporate.ge.com/UserAuthenticationProject/Services/ProxyService/EntryLogWrapper', body2, { responseType: 'text' }).subscribe
            (data => {
           // console.log('Pushed data to DB', data);
        },
        err => {
            console.log( err);
        }
        );
    }

    getJenkinsXML(no) {
        this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/' + no + '/api/xml', { responseType: 'text' })
            .subscribe(
                res1 => {
                    console.log('Success ' + res1);
                    const res2 = res1;
                    const loc1 = res1.indexOf('<result>') + 8;
                    const endloc1 = res1.indexOf('</result>');
                    const str1 = res1.substring(loc1, endloc1);
                    console.log('firstStr', str1);
                    console.log('before loc2:', res1);

                    if (str1 === 'SUCCESS') {
                        //  alert(str1);
                        this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/' + no + '/logText/progressiveText?start=0', { responseType: 'text' })
                            .subscribe(
                                res => {
                                    console.log('Success ' + res);
                                    const loc = res.indexOf('Total time:') + 12;
                                    const endloc = res.indexOf('-');
                                    const str = res.substr(loc, endloc - 1);
                                    console.log('secondStr', str);
                                    if (str !== '') {
                                        this.isSuccess = true;
                                        //  alert(str);
                                        this.buildText = str;
                                        const loc2 = res2.indexOf('<relativePath>') + 14;
                                        const endloc2 = res2.indexOf('</relativePath>');
                                        const op = res2.substring(loc2, endloc2);
                                        console.log('download loc: ', loc2, endloc2, op);
                                        this.sendToDB();
                                        this.download(no, op);

                                        //  sub.unsubscribe();
                                    } else {
                                        console.log('fail', str);
                                    }
                                },
                                err => {
                                    console.log(err);
                                    alert(JSON.stringify(err));
                                }
                            );
                        //  sub.unsubscribe();
                    } else {
                        //console.log(str1);
                        this.isFail = true;
                    }
                },
                err1 => {
                    console.log(err1);
                    alert(JSON.stringify(err1));
                }
            );
    }

    download(no, op) {
        //console.log(no, op);

        const downloadUrl = 'http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/' + no + '/artifact/' + op;

        const filename = op.substring(7, );

        this.httpold.get(downloadUrl, {
            headers: null,
            responseType: ResponseContentType.Blob
        }).map(res => new Blob([res.blob()], { type: 'application/vnd.ms-excel' }))

            .subscribe(
                data => {
                   // console.log('Download success', data);
                    let blob = data;
                    let a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                },
                err1 => {
                    console.log('Download failed', err1);
                    alert(JSON.stringify('Download failed : ', err1));
                }
            );
    }



    onSubmit(form: NgForm) {
        this.val = 0;
        this.isFail = false;
        this.isSuccess = false;
        //    console.log(form.value.svnurl, form.value.user, form.value.pass);
        this.onClick(form.value.svnurl, form.value.user, form.value.pass, form.value.integration);
    }

    // https://openge.ge.com/svn/soacoe/tags/Power/WellandMES/AprilRelease/DPERP-WELLANDMES-Integrations/

    onClick(svnurl, user, pass, integration) {
        console.log('method triggered');
        // tslint:disable:max-line-length
        this.http.post('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/buildWithParameters?token=remoteToken&svnurl=' + svnurl + '&username=' + user + '&password=' + pass + '&integration=' + integration, null, { headers: {} })
            .subscribe(
                res => {
                    console.log('Success post ' + res);
                },
                err => {
                    console.log('Error occured ' + err);                    
                   alert('Network Communication issue. Please ensure you are connected to GE VPN or the network is functioning properly.');
                    return;
                }
            );
        let i = 0;
        const initTimer = Observable.timer(0, 1000);

        const initSub: Subscription = initTimer.subscribe(tick => {
            i++;
            this.val += 4;
           // console.log('delay');
            if (i === 25) {
                initSub.unsubscribe();
               // console.log('Reesh');
                this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/lastBuild/buildNumber', { responseType: 'text' })
                    .subscribe(
                        res => {
                           // console.log('Success get' + res);
                            this.getJenkinsXML(res);
                        },
                        err => {
                            console.log('Error occured ' + err);
                            alert('Network Communication issue. Please ensure you are connected to GE VPN or the network is functioning properly.');
                            return;
                        }
                    );
            }
        });

        /*  this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/lastBuild/buildNumber', { responseType: 'text' })
              .subscribe(
                  res => {
                      console.log('Success ' + res);
                  },
                  err => {
                      console.log('Error occured ' + err);
                  }
              );*/


        /*let headerss = new Headers();
        headerss.append('Content-Type', 'application/x-www-form-urlencoded');
        headerss.append('Accept', 'application/json');
        headerss.append('Authorization', 'Basic ' + 'NTAzMDM1MzYyOlBpbmd1QDE3UmlzaA==');
        let options = new RequestOptions({ headers: headerss });*/

        /*
     
          let headers = new HttpHeaders({
              'svnurl': 'test',
              'username': 'test',
              'password': 'test'
          });
     
     
          // tslint:disable:max-line-length
          // 'http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/buildWithParameters?token=remoteToken&svnurl=https://openge.ge.com/svn/soacoe/tags/Power/WellandMES/AprilRelease/DPERP-WELLANDMES-Integrations/&username=rishi.sridhar&password=rishi.sridhar'
          this.http.post('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/buildWithParameters?token=remoteToken', httpOptions).subscribe(
              error => console.log(error)
          );*/
    }



    /*   onClicky() {
  
          let i = 1;
          const initTimer = Observable.timer(0, 1500);
  
          const initSub: Subscription = initTimer.subscribe(tick => {
              initSub.unsubscribe();
              console.log('1.5 sec');
          });
  
          this.service.getReq()
              .subscribe(
                  res => {
                      console.log('Success ' + res);
                      const loc = res.indexOf('Finished:') + 9;
                      // const endloc = data.indexOf('</ns1:isAuthenticated>');
                      const str = res.substr(loc, );
                      console.log('Stttring', str);
                      if (str !== '') {
                          alert('Done');
                          //  sub.unsubscribe();
                      }
                  },
                  err => {
                      console.log(err);
                      alert(JSON.stringify(err));
                  }
              );
   */
    /*   const timer = Observable.timer(0, 1000);
 
       const sub: Subscription = timer.subscribe(tick => {
           i++;
           console.log(i);
           // this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/lastBuild/logText/progressiveText?start=0', { responseType: 'text' })
 
           console.log('loggyyyy');
           if (i === 10) {
               sub.unsubscribe();
           }
 
       });*/

    // tslint:disable:max-line-length
    /*this.http.get('http://alpmdmappdvn01.corporate.ge.com:8008/job/GEDocumentationAutoGenerator/lastBuild/api/xml', { responseType: 'text' })
        .subscribe(
            res => {
                console.log('Success ' + res);
            },
            err => {
                console.log(err);
                alert(JSON.stringify(err));
            }
        );*/
}

