import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { AppState } from '@app/models';
import { distinctUntilChanged } from 'rxjs/internal/operators';
import * as equal from 'fast-deep-equal';
import { Subscription } from 'rxjs';

interface Connection {
	subscriber: any;
	selector: any;
}

@Injectable()
export class StoreService {
	constructor(private store$: Store<AppState>) {}
	connect(connections: Connection[]) {
		const subscriptions = connections.reduce((acc, connection) => {
			const subscription = this.createSubscription(
				connection.selector
			).subscribe(connection.subscriber);
			acc.push(subscription);
			return acc;
		}, []);
		return this.disconnect(subscriptions);
	}

	createSubscription(selector: any) {
		return this.store$.pipe(
			select(selector),
			distinctUntilChanged((prev, curr) => equal(prev, curr))
		);
	}

	dispatch(action: Action) {
		return this.store$.dispatch(action);
	}

	private disconnect(subscriptions: Subscription[] = []) {
		return () => {
			subscriptions.forEach(s => s.unsubscribe());
		};
	}
}
