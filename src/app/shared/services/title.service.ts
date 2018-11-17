import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Meta, Title} from '@angular/platform-browser';
import {Settings} from './settings.service';
import {filter} from 'rxjs/operators/filter';
import {map} from 'rxjs/operators/map';
import {mergeMap} from 'rxjs/operators/mergeMap';

@Injectable()
export class TitleService {

    /**
     * Data of currently active route.
     */
    private routeData: object;

    /**
     * TitleService Constructor.
     */
    constructor(
        private router: Router,
        private title: Title,
        private meta: Meta,
        private settings: Settings,
    ) {
    }

    /**
     * Init title service.
     */
    public init() {
        this.bindToRouterEvents();

    }

    /**
     * Get page title for specified route.
     */
    private getTitle(): string {
      return this.getDefaultTitle();
    }
    private getMetaTags() {
      return [this.settings.get('companyName'), this.settings.get('selectedIndustry').split('_').join(' '), 'Webchoice'].concat(this.settings.get('about').split(' '));
    }

    /**
     * Get default page title.
     */
    private getDefaultTitle() {
      // console.log('Settings ', this.settings.get('companyName'));
        // return this.settings.get('branding.site_name');
        return this.settings.get('companyName');
    }

    /**
     * Change page title on route change.
     */
    private bindToRouterEvents() {
        this.router.events
            .pipe(
                filter(e => e instanceof NavigationEnd),
                map(() => {
                    let route = this.router.routerState.root;
                    while (route.firstChild) { route = route.firstChild; }
                    return route;
                }),
                filter(route => route.outlet === 'primary'),
                mergeMap(route => route.data)
            )
            .subscribe(data => {
                this.routeData = data;
                this.title.setTitle(this.getTitle());
                  document.getElementById('favicon')['href'] = this.settings.get('companyLogo');
                  document.getElementById('metaTags')['content'] = this.getMetaTags();
              });
    }
}
