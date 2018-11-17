import { Injectable, Injector } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Settings} from './settings.service';
import { environment as ENV } from '../../../environments/environment';

export function init_app(bootstrapper: Bootstrapper) {
    return () => bootstrapper.bootstrap();
}

@Injectable()
export class Bootstrapper {

    /**
     * HttpClient service instance.
     */
    private http: HttpClient;

    /**
     * Settings service instance.
     */
    private settings: Settings;

    /**
     * Boostrapper constructor.
     */
    constructor(private injector: Injector) {
        this.http = this.injector.get(HttpClient);
        this.settings = this.injector.get(Settings);
    }

    /**
     * Bootstrap application with data returned from server.
     */
    public bootstrap(data?: string): Promise<any> {
        if ( ! data) { data = window['bootstrapData']; }

        // if we have bootstrap data in global scope, pass
        // it to the app and return self resolving promise
        if (data) {
            this.handleData(data);
            return new Promise(resolve => resolve());
        }

        // fetch bootstrap data from backend and return promise that
        // resolves once request is complete and data is passed to the app
      // console.log('Hello ', 'http://softquest.webchoice.ng'.split('.webchoice.ng')[0].split('http://')[1]);

      return new Promise((resolve, reject) => {/*
        if (window.location.href.includes('.webchoice.ng')) {
          // console.log('Hello ', 'softquest.webchoice.ng'.split('.webchoice.ng'));
          const href = window.location.href.split('.webchoice.ng');
          let _data;
          if (href[0].includes('https://')) {
            _data = href[0].split('https://')[1];
          } else if (href[0].includes('http://')) {
            _data = href[0].split('http://')[1];
          } else {
            _data = href[0];
          }*/
          // console.log('Href : ', _data);
          const url = `${ENV.API_URL}/${ENV.API_VERSION}/quick-build/subdomain/user/larsatt087`;
          // const url = `${ENV.API_URL}/${ENV.API_VERSION}/quick-build/subdomain/user/${_data}`;
          // const url = `${ENV.API_URL}/${ENV.API_VERSION}/quick-build/subdomain/user/larsatt1`;
          this.http.get(url).subscribe(response => {
            console.log('Data ,', response['data']);
            this.handleData(response['data']);
            resolve();
          }, error => {
            console.log('bootstrap error', error);
            sessionStorage.setItem('userWebsite', window.location.href);
            window.location.href = `${ENV.APP_DOMAIN}/website-not-found`;
            reject();
          });
        /*} else {
         window.location.href = `${ENV.APP_DOMAIN}/website-not-found`;
          reject();
        }*/
        });
    }

    /**
     * Handle specified bootstrap data.
     */
    private handleData(encodedData: string) {
        // decode bootstrap data from server
        const data = encodedData; //  decode
        // const data = JSON.parse(atob(encodedData));
        // set all settings returned from server
        this.settings.setMultiple(data);
    }
}
