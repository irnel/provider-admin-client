import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

import { Order } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private readonly afs: AngularFirestore) { }

  getAllOrdersByProviderId(providerId, date: Date) {
    const collection = this.afs.collection(
      `orders/${providerId}/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`,
      query => query.orderBy('pickupTime')
    );

    // const collection = this.afs.collection(
    //     `orders/${providerId}/2019/4/9`,
    //     query => query.orderBy('pickupTime')
    // );

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const order = action.payload.doc.data() as Order;
          order.id = action.payload.doc.id;

          return order;
        }
      ))
    );
  }

  getOrderData(providerId, orderId, date: Date) {
    const orderDoc = this.afs.doc(
      `orders/${providerId}/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${orderId}`);

    return orderDoc.snapshotChanges().pipe(
      map(snapshot => {
        const order = snapshot.payload.data() as Order;
        order.id = snapshot.payload.id;

        return order;
      })
    );
  }

  update(order: Order, date: Date) {
    const orderDoc = this.afs.doc(
      `orders/${order.providerId}/${date.getFullYear()}/${date.getMonth()}/${date.getDate()}/${order.id}`);

    return orderDoc.update(order);
  }
}
