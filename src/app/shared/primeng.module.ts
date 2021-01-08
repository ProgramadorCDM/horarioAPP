import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Prime NG
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { FieldsetModule } from 'primeng/fieldset';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PickListModule } from 'primeng/picklist';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ChartModule } from 'primeng/chart';
import { KeyFilterModule } from 'primeng/keyfilter';
import { CardModule } from 'primeng/card';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';




const myModule = [
  ToolbarModule,
  ButtonModule,
  SplitButtonModule,
  TabViewModule,
  ToastModule,
  MessagesModule,
  MessageModule,
  ConfirmDialogModule,
  PanelModule,
  ScrollPanelModule,
  InputTextModule,
  MenubarModule,
  TableModule,
  PaginatorModule,
  DialogModule,
  DropdownModule,
  CalendarModule,
  FileUploadModule,
  SidebarModule,
  FieldsetModule,
  OverlayPanelModule,
  TooltipModule,
  MultiSelectModule,
  InputSwitchModule,
  DynamicDialogModule,
  PickListModule,
  ToggleButtonModule,
  ChartModule,
  KeyFilterModule,
  CardModule,
  GalleriaModule,
  InputNumberModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, myModule],
  exports: [myModule],
  providers: [],
})
export class PrimengModule {}
