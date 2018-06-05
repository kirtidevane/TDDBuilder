import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { BlankPageRoutingModule } from './blank-page-routing.module';
import { BlankPageComponent } from './blank-page.component';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpserviceService } from './httpservice.service';

@NgModule({
    imports: [CommonModule, BlankPageRoutingModule, HttpClientModule, HttpModule, FormsModule, ReactiveFormsModule],
    declarations: [BlankPageComponent],
    providers: [HttpserviceService]
})
export class BlankPageModule { }
