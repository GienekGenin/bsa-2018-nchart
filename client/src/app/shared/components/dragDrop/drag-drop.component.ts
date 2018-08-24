import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { SchemeID } from '@app/models/normalizr.model';
import { UserMappingColumn } from '@app/models/user-chart-store.model';
import {
	RemoveDimension,
	SelectDimension
} from '@app/store/actions/charts/charts.actions';
import { StoreService } from '@app/services/store.service';
import { getData } from '@app/store/selectors/charts.selectors';

class Column implements UserMappingColumn {
	constructor(
		public id: SchemeID,
		public variable: string,
		public type: string
	) {}
}

@Component({
	selector: 'app-drag-drop',
	templateUrl: './drag-drop.component.html'
})
export class DragDropComponent implements OnInit, OnDestroy {
	DIMENSIONS = 'DIMENSIONS';

	@Input()
	dimensionsSettings = [];

	@Input()
	columns: UserMappingColumn[] = [];
	public dimensions = [];

	data;

	subs = new Subscription();
	constructor(
		private _dragulaService: DragulaService,
		private storeService: StoreService
	) {
		_dragulaService.createGroup(this.DIMENSIONS, {
			copy: (el, source) => {
				return source.id === 'columns';
			},
			copyItem: (column: Column) => {
				return new Column(column.id, column.variable, column.type);
			},
			accepts: (el, target, source, sibling) => {
				return target.id !== 'columns';
			}
		});

		this.subs.add(
			this._dragulaService
				.dropModel(this.DIMENSIONS)
				.subscribe(
					({
						name,
						el,
						target,
						source,
						sibling,
						sourceModel,
						targetModel,
						item
					}) => {
						if (
							!this.isValid(
								target.parentElement.firstElementChild
									.innerHTML,
								item
							)
						) {
							targetModel.splice(targetModel.indexOf(item), 1);
						} else if (
							!this.hasPlace(
								target.parentElement.firstElementChild
									.innerHTML,
								item
							)
						) {
							targetModel.splice(targetModel.indexOf(item), 1);
						} else if (this.hasDuplicates(targetModel)) {
							targetModel.splice(targetModel.indexOf(item), 1);
						} else {
							this.storeService.dispatch(
								new SelectDimension({
									dimensionId: target['dataset'].dimensionid,
									columnId: item.id
								})
							);
							// TODO: send action to set columns
						}
					}
				)
		);
	}

	ngOnInit() {
		this.storeService.connect([
			{
				selector: getData(),
				subscriber: data => {
					this.data = data;
				}
			}
		]);
	}

	getClasses(multiple, required) {
		return {
			multiple: multiple,
			required: required
		};
	}

	hasDuplicates(array) {
		length = array.length;
		array = array.filter(
			(thing, index, self) =>
				index === self.findIndex(t => t.variable === thing.variable)
		);
		return length !== array.length;
	}

	isValid(target: string, item: Column) {
		const dimension = this.dimensionsSettings.filter(obj => {
			return obj.variable === target;
		});

		const isValid = dimension[0].type.indexOf(item.type);
		return isValid !== -1;
	}

	hasPlace(target: string, item: Column) {
		const dimension = this.dimensionsSettings.filter(obj => {
			return obj.variable === target;
		});
		const isMultiple = dimension[0].multiple;
		const hasPlace = dimension[0].value.length;
		return isMultiple ? isMultiple : hasPlace === 0;
	}

	remove(item, { target }) {
		this.storeService.dispatch(
			new RemoveDimension({
				dimensionId: target['dataset'].dimensionid,
				columnId: item.id
			})
		);
	}

	removeAll() {
		this.dimensionsSettings.forEach(element => {
			element.value = [];
		});
	}

	ngOnDestroy() {
		this.subs.unsubscribe();
		this._dragulaService.destroy(this.DIMENSIONS);
	}
}
