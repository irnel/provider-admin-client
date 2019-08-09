import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Product } from '../../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private afs: AngularFirestore) {}

  getAllProductsData(providerId, categoryId) {
    const collection = this.afs.collection(`products/${providerId}/list/${categoryId}/list`);

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const product = action.payload.doc.data() as Product;
          product.id = action.payload.doc.id;

          return product;
        }
      ))
    );
  }

  getProductData(providerId, categoryId, productId) {
    const productDoc = this.afs.doc(
      `products/${providerId}/list/${categoryId}/list/${productId}`);

    return productDoc.snapshotChanges()
      .pipe(
        map(snapshot => {
          const product = snapshot.payload.data() as Product;
          product.id = snapshot.payload.id;

          return product;
        })
      );
  }

  async create(product: Product) {
    const collection = this.afs.collection(
      `products/${product.providerId}/list/${product.categoryId}/list`);

    return await collection.add(product).then(async docRef => {
      return await docRef.get().then(async snapshot => {
        const productDoc = snapshot.data() as Product;
        productDoc.id = snapshot.id;

        return productDoc;
      });
    });
  }

  update(product: Product) {
    const productDoc = this.afs.doc(
      `products/${product.providerId}/list/${product.categoryId}/list/${product.id}`);

    return productDoc.update(product);
  }

  delete(product: Product) {
    const productDoc = this.afs.doc(
      `products/${product.providerId}/list/${product.categoryId}/list/${product.id}`);

    return productDoc.delete();
  }
}
