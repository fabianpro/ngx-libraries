var IDBTransaction: any;

export enum TXMode {
	readonly = 'readonly',
	readwrite = 'readwrite'
}

export function existStore(db: IDBDatabase, storeName: string): boolean {	
	return db.objectStoreNames.contains(storeName);
}

export function createTx(db: IDBDatabase, storeName: string, mode: TXMode) {
	const tx = IDBTransaction = db.transaction(storeName, mode);
	return tx;
}

export function getPK(item: any) {
	return item.hasOwnProperty('pk') && item['pk'] ? item['pk'] : null;
}
