import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Cashier } from '../../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  cashierCollection: AngularFirestoreCollection<Cashier>;

  constructor(private afs: AngularFirestore) {}

  getAllCashiersByProviderId(providerId) {
    const collection = this.afs.collection(`cashiers/${providerId}/list`);

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const cashier = action.payload.doc.data() as Cashier;
          cashier.id = action.payload.doc.id;

          return cashier;
        }
      ))
    );
  }

  getCashierData(providerId, cashierId) {
    const cashierDoc = this.afs.doc(`cashiers/${providerId}/list/${cashierId}`);

    return cashierDoc.snapshotChanges().pipe(
      map(snapshot => {
        const cashier = snapshot.payload.data() as Cashier;
        cashier.id = snapshot.payload.id;

        return cashier;
      })
    );
  }

  create(cashier: Cashier) {
    const collection = this.afs.collection(`cashiers/${cashier.providerId}/list`);

    return collection.add(cashier).then(docRef => {
      return docRef.get().then(snapshot => {
        const cashierDoc = snapshot.data() as Cashier;
        cashierDoc.id = snapshot.id;

        return cashier;
      });
    });
  }

  update(cashier: Cashier) {
    const cashierDoc = this.afs.doc(`cashiers/${cashier.providerId}/list/${cashier.id}`);
    return cashierDoc.update(cashier);
  }

  delete(cashier) {
    const cashierDoc = this.afs.doc(`cashiers/${cashier.providerId}/list/${cashier.id}`);
    return cashierDoc.delete();
  }
}
