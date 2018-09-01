import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { DatasetColumn } from '@app/models/dataset.model';
import { StoreService } from '@app/services/store.service';
import {
	getDatasetValues,
	getDatasetHeaders
} from '@app/store/selectors/dataset.selectors';
import * as DatasetActions from '@app/store/actions/datasets/datasets.actions';
import { SchemeID } from '@app/models/normalizr.model';
import { activeDatasetId } from '@app/store/selectors/dataset.selectors';
import { MenuItem } from 'primeng/api';

@Component({
	selector: 'app-data-table',
	templateUrl: './data-table.component.html',
	styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements OnInit, OnDestroy {
	disconnect: () => void;
	columns: DatasetColumn[];
	datasetId: SchemeID;
	data: any[][];
	selectedRows = [];
	checkedAll: boolean;
	rowItems = (rowId): MenuItem[] => {
		return [
			{
				label: 'New row',
				icon: 'fa fa-plus',
				command: () => {
					this.addNewRow();
				}
			},
			{
				label: 'Delete row',
				icon: 'fa fa-trash',
				command: () => {
					this.removeRow(rowId);
				}
			}
		];
		// tslint:disable-next-line:semicolon
	};

	headerRowItems = (): MenuItem[] => {
		return [
			{
				label: 'New row',
				icon: 'fa fa-plus',
				// url: '#/draft/project',
				command: () => {
					this.addNewRow();
				}
			},
			{
				label: 'New column',
				icon: 'fa fa-plus',
				// url: '#/draft/project',
				command: () => {
					this.addNewColumn();
				}
			}
		];
		// tslint:disable-next-line:semicolon
	};

	headerItems = columnId => {
		return [
			{
				label: 'New column',
				icon: 'fa fa-plus',
				// url: '#/draft/project',
				command: () => {
					this.addNewColumn();
				}
			},
			{
				label: 'To number',
				url: '#/draft/project',
				command: () => {
					this.changeColumnType('number', columnId);
				}
			},
			{
				label: 'To string',
				// url: '#/draft/project',
				command: () => {
					this.changeColumnType('string', columnId);
				}
			},
			{
				label: 'To boolean',
				// url: '#/draft/project',
				command: () => {
					this.changeColumnType('boolean', columnId);
				}
			},
			{
				label: 'Delete column',
				icon: 'fa fa-trash',
				// url: '#/draft/project',
				command: () => {
					this.removeColumn(columnId);
				}
			}
		];
		// tslint:disable-next-line:semicolon
	};

	getSelectedRows(rows) {
		this.selectedRows = rows;
	}

	// transformData(data, columns?) {
	// 	return this.datasetService.transformDatasets([{
	// 		id: this.datasetId,
	// 		columns: columns || this.columns,
	// 		data: data.map(d => d.map(v => v.value))
	// 	}])[0];
	// }

	removeColumn(columnId) {
		this.storeService.dispatch(
			new DatasetActions.DeleteColumn({
				columnId: columnId,
				datasetId: this.datasetId
			})
		);
	}

	removeRow(rowId) {
		this.storeService.dispatch(
			new DatasetActions.DeleteRow({
				datasetId: this.datasetId,
				id: this.selectedRows.length ? this.selectedRows : [rowId],
				keys: this.data
			})
		);
		this.selectedRows = [];
	}

	// checkRows(i) {
	// 	return this.selectedRows.length ?
	// 		this.data.filter(
	// 			(data, row) => !this.selectedRows.includes(row)
	// 		) : this.data.filter(
	// 			(data, row) => row !== i
	// 		);
	// }

	addNewColumn() {
		// this.columns.push({
		// 	id: v4(),
		// 	title: 'Header',
		// 	type: 'string'
		// });
		this.storeService.dispatch(
			new DatasetActions.AddNewColumn({
				datasetId: this.datasetId
			})
		);
	}

	addNewRow() {
		// this.data.push(this.columns.map(e => ({id: null, value: ''})));
		// this.storeService.dispatch(
		// 	new DatasetActions.AddNewRow({
		// 		datasetId: this.datasetId,
		// 		data: this.transformData(this.data)
		// 	})
		// );
	}

	changeColumnType(type, columnId) {
		this.storeService.dispatch(
			new DatasetActions.ChangeColumnType({
				datasetId: this.datasetId,
				columnId: columnId,
				type,
				data: this.getDataByCol(type, columnId)
			})
		);
	}

	getDataByCol(type, columnId) {
		const result = [];
		this.data.filter(dataArr =>
			dataArr.map(data => {
				if (data.id.includes(`-${columnId}-`)) {
					data.value = this.convertDataType(type, data.value);
					result.push(data);
				}
			})
		);
		return result;
	}

	convertDataType(type, value) {
		switch (type) {
			case 'string':
				value += '';
				break;
			case 'number':
				value = +value ? +value : 0;
				break;
			case 'boolean':
				value = !!value;
				break;
		}
		return value;
	}

	constructor(element: ElementRef, private storeService: StoreService) {}

	ngOnInit() {
		this.disconnect = this.storeService.connect([
			{
				subscriber: (dataHeaders: DatasetColumn[]) => {
					this.columns = dataHeaders;
				},
				selector: getDatasetHeaders()
			},
			{
				subscriber: data => {
					this.data = data;
				},
				selector: getDatasetValues()
			},
			{
				subscriber: id => {
					this.datasetId = id;
				},
				selector: activeDatasetId()
			}
		]);
	}

	change({ value, i, col }) {
		value = this.convertDataType(this.columns[col].type, value);
		this.storeService.dispatch(
			new DatasetActions.ChangeContent({
				id: this.data[i][col].id,
				value: value
			})
		);
	}

	headerChange({ title, i }) {
		this.storeService.dispatch(
			new DatasetActions.ChangeHeaderTitle({
				id: this.columns[i].id,
				title: title
			})
		);
	}

	ngOnDestroy() {
		this.disconnect();
	}
}
