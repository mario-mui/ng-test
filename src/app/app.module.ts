import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TreeGridModule, ResizeService, ContextMenuService, VirtualScrollService, FilterService, SortService, RowDDService } from '@syncfusion/ej2-angular-treegrid';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule, CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { PurePipe } from './pure.pipe';
import { SortablejsModule } from 'ngx-sortablejs';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';

@NgModule({
  declarations: [
    AppComponent,
    PurePipe,
  ],
  imports: [
    BrowserModule,
    TreeGridModule,
    DropDownListAllModule,
    DialogModule,
    FormsModule,
    CommonModule,
    ButtonModule,
    CheckBoxModule,
    ColorPickerModule,
    DatePickerModule,
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [
    ResizeService, 
    ContextMenuService,
    VirtualScrollService,
    FilterService,
    SortService,
    RowDDService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
