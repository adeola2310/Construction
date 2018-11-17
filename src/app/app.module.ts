import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent} from "./shared/components/header/header.component";
import { CoreModule } from './shared/modules/core.module';
import { SanitizeHtmlPipe } from './shared/pipes/sanitize-html.pipe';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    CoreModule.forRoot(),
    ScrollToModule.forRoot(),
    
  ],
  providers: [
    SanitizeHtmlPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
