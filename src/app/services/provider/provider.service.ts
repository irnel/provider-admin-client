import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';

import { Provider } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  providerCollection: AngularFirestoreCollection<Provider>;

  constructor(private readonly afs: AngularFirestore) {
    this.providerCollection = this.afs.collection('providers');
  }

  getAllProviderByUserId(userId) {
    const collection = this.afs.collection(
      'providers', query => query.where('userId', '==', userId));

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const provider = action.payload.doc.data() as Provider;
          provider.id = action.payload.doc.id;

          return provider;
        })
      )
    );
  }

  getProviderById(providerId) {
    return this.providerCollection.doc(providerId).snapshotChanges()
      .pipe(
        map(snapshot => {
          const provider = snapshot.payload.data() as Provider;
          provider.id = snapshot.payload.id;

          return provider;
        })
      );
  }

  async create(provider: Provider) {
    return await this.providerCollection.add(provider).then(async docRef => {
      return await docRef.get().then(async snapshot => {
        const providerDoc = snapshot.data() as Provider;
        providerDoc.id = snapshot.id;

        return providerDoc;
      });
    });
  }

  update(provider: Provider) {
    return this.providerCollection.doc(provider.id).update(provider);
  }

  delete(provider: Provider) {
    return this.providerCollection.doc(provider.id).delete();
  }
}
