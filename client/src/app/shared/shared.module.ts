import { NgModule } from '@angular/core';
import { UIKitModule } from '@app/shared/uikit.module';
import { FormFieldModule } from '@app/shared/components/form-field/form-field.module';
import { ActionButtonComponent } from '@app/shared/components/button/action-button/action-button.component';
import { HeaderModule } from '@app/shared/components/header/header.module';
import { MainBlockComponent } from '@app/shared/components/main-block/main-block.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LinkComponent } from '@app/shared/components/link/link.component';
import { DragDropComponent } from '@app/shared/components/dragDrop/drag-drop.component';
import { ChartsModule } from '@app/shared/components/charts/charts.module';
import { DialogComponent } from '@app/shared/components/dialog/dialog.component';
import { CardComponent } from '@app/shared/components/card/card.component';
import { DeleteDialogComponent } from '@app/shared/deleteDialog/delete-dialog.component';
import { TableComponent } from '@app/shared/components/table/table.component';
import { PopupMenuComponent } from '@app/shared/components/button/popup-menu/popup-menu.component';
import { NotificationComponent } from '@app/shared/notification/notification.component';

@NgModule({
	imports: [
		UIKitModule,
		FormFieldModule,
		HeaderModule,
		BrowserAnimationsModule,
		ChartsModule
	],
	exports: [
		ActionButtonComponent,
		FormFieldModule,
		HeaderModule,
		ChartsModule,
		UIKitModule,
		MainBlockComponent,
		DragDropComponent,
		LinkComponent,
		DialogComponent,
		CardComponent,
		DeleteDialogComponent,
		TableComponent,
		PopupMenuComponent,
		NotificationComponent
	],
	declarations: [
		ActionButtonComponent,
		DragDropComponent,
		MainBlockComponent,
		LinkComponent,
		DialogComponent,
		CardComponent,
		DeleteDialogComponent,
		TableComponent,
		PopupMenuComponent,
		NotificationComponent
	]
})
export class SharedModule {}
