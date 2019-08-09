import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Category } from '../../models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private readonly afs: AngularFirestore) {}

  getAllCategoriesByProviderId(providerId) {
    const collection = this.afs.collection(`categories/${providerId}/list`);

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const category = action.payload.doc.data() as Category;
          category.id = action.payload.doc.id;

          return category;
        }
      ))
    );
  }

  getCategoryData(providerId, categoryId) {
    const categoryDoc = this.afs.doc(`categories/${providerId}/list/${categoryId}`);

    return categoryDoc.get().pipe(
      map(snapshot => {
        const category = snapshot.data() as Category;
        category.id = snapshot.id;

        return category;
      })
    );
  }

  async create(category: Category) {
    const collection = this.afs.collection(`categories/${category.providerId}/list`);

    return await collection.add(category).then(async docRef => {
      return await docRef.get().then(async snapshot => {
        const categoryDoc = snapshot.data() as Category;
        categoryDoc.id = snapshot.id;

        return categoryDoc;
      });
    });
  }

  update(category: Category) {
    const categoryDoc = this.afs.doc(`categories/${category.providerId}/list/${category.id}`);
    return categoryDoc.update(category);
  }

  delete(category: Category) {
    const categoryDoc = this.afs.doc(`categories/${category.providerId}/list/${category.id}`);
    return categoryDoc.delete();
  }
}
