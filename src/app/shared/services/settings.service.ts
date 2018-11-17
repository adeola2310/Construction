import {EventEmitter, Injectable} from '@angular/core';
import {AppHttpClient} from './http/app-http-client.service';


@Injectable()
export class Settings {

    /**
     * HttpClient Service instance.
     */
    private http: AppHttpClient;

    /**
     * Public settings.
     */
    private all = <any>{};

    /**
     * Backend CSRF TOKEN.
     */
    public csrfToken: string;

    /**
     * Fired when any of the settings are changed manually.
     */
    public onChange: EventEmitter<string> = new EventEmitter();

    /**
     * Settings Constructor.
     */
    constructor() {}

    /**
     * Set multiple settings on settings service.
     */
    public setMultiple(settings: any) {
        /*for (const key in settings) {
            const value = key['value'];
          // console.log('Here are setting : ', key['name'], value);
            this.set(key, value);
        }*/
        this.all = settings;
    }

    /**
     * Set single setting.
     */
    public set(name: string, value: string|number, fireEvent = false) {
        this.all[name] = value;
        if (fireEvent) { this.onChange.emit(name); }
    }

    /**
     * Get a setting by key, optionally providing default value.
     */
    public get(name: string, defaultValue: any = null) {
        const value = this.all[name];

        if (value === undefined) {
            return defaultValue;
        } else {
            return value;
        }
    }

    /**
     * Get all settings.
     */
    public getAll() {
        return this.all;
    }

    /**
     * Check if setting with specified name exists.
     */
    public has(name: string): boolean {
        return this.all[name] != null;
    }

    /**
     * Get a json setting by key and decode it.
     */
    public getJson(name: string, defaultValue: any = null) {
        const value = this.get(name, defaultValue);
        if (typeof value !== 'string') { return value; }
        return JSON.parse(value);
    }

    /**
     * Get base url for the app.
     */
    public getBaseUrl(forceServerUrl = false): string {
        // sometimes we might need to get base url supplied by backend
        // even in development environment, for example, to prevent
        // uploaded images from having proxy urls like "localhost:4200"
        if (this.has('base_url') && forceServerUrl) {
            return this.get('base_url') + '/';
        } else if (document.querySelector('base')) {
            return document.querySelector('base')['href'];
        } else {
            return 'http://';
        }
    }

    /**
     * Get app's asset base url.
     */
  /*  public getAssetUrl(): string {
        let base = this.getBaseUrl();

        // in production assets will be in "client" sub-folder
        if (this.vebtoConfig.get().environment === 'production') {
            base += 'client/';
        }

        return base + 'assets/';
    }*/

    /**
     * Save specified setting on the server.
     */
    public save(params: {client?: object, server?: object}) {
        this.setMultiple(params.client);
        const encoded = btoa(encodeURIComponent(JSON.stringify(params)));
        return this.http.post('settings', {settings: encoded});
    }

    /**
     * Check if any social login is enabled.
     */
    public anySocialLoginEnabled() {
        const names = ['facebook', 'google', 'twitter'];
        return names.filter(name => this.get('social.' + name + '.enable')).length > -1;
    }

    /**
     * Set HttpClient instance.
     */
    public setHttpClient(http: AppHttpClient) {
        this.http = http;
    }
}
