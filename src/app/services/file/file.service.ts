import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';

import { Observable, combineLatest } from 'rxjs';
import { DataTransfer } from '../../helpers';
import { map } from 'rxjs/operators';
import { FileInfo } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  uploads: DataTransfer [] = [];
  filesCollection: AngularFirestoreCollection;
  storageRef: AngularFireStorageReference;
  uploadTask: AngularFireUploadTask;

  constructor(
    private readonly storage: AngularFireStorage,
    private readonly afs: AngularFirestore,
    ) {
      this.filesCollection = this.afs.collection('filesinfo');
    }

  upload(filesInfo: FileInfo [], model: any) {
    const totalPercentage: Observable<number>[] = [];

    for (const fileInfo of filesInfo) {
      fileInfo.modelId = model.id;

      const basePath = `${fileInfo.modelType}/${fileInfo.createdAt.getTime()}_${fileInfo.name}`;
      const docFileRef = `filesinfo/${fileInfo.modelId}/list`;
      this.storageRef = this.storage.ref(basePath);
      this.uploadTask = this.storage.upload(basePath, fileInfo.file);

      const percentage$ = this.uploadTask.percentageChanges();
      totalPercentage.push(percentage$);

      // push each upload into array
      this.uploads.push({
        name: fileInfo.name,
        percentage: percentage$
      });

      this.uploadTask.then(snapshot => {
        return snapshot.ref.getDownloadURL().then(url => {
          return this.afs.collection(docFileRef).add({
           name: fileInfo.name,
           size: fileInfo.size,
           type: fileInfo.type,
           modelType: fileInfo.modelType,
           modelId: fileInfo.modelId,
           url: url,
           createdAt: fileInfo.createdAt,
           markAsPrincipal: fileInfo.markAsPrincipal
          }).then(() => {
            // update image url of model
            if (fileInfo.markAsPrincipal) {
              let docRef: AngularFirestoreDocument;
              model.url = url;

              switch (fileInfo.modelType) {
                case 'providers': {
                  docRef = this.afs.doc(`providers/${model.id}`);
                  break;
                }
                case 'categories': {
                  docRef = this.afs.doc(`categories/${model.providerId}/list/${model.id}`);
                  break;
                }
                case 'products': {
                  docRef = this.afs.doc(
                    `products/${model.providerId}/list/${model.categoryId}/list/${model.id}`);
                  break;
                }
                default:
                  break;
              }

              docRef.update(model);
            }
          });
        });
      });
    }

    // All percentages
    return combineLatest(totalPercentage).pipe(
      map(percentages => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }

        return Math.round(result / percentages.length);
      })
    );
  }

  // add document to images collection
  addFileInfo(fileInfo: FileInfo) {
    this.filesCollection.add(fileInfo);
  }

  getAllFilesInfoByModelId(modelId) {
    const collection = this.afs.collection(`filesinfo/${modelId}/list`);

    return collection.snapshotChanges().pipe(
      map(actions => actions.map(
        action => {
          const file = action.payload.doc.data() as FileInfo;
          file.id = action.payload.doc.id;

          return file;
        }
      ))
    );
  }

  updateFileInfo(file: FileInfo, model: any) {
    let modelDoc: AngularFirestoreDocument;
    const collectionRef = this.afs.collection(`filesinfo/${model.id}/list`);
    const newFileDoc = this.afs.doc(`filesinfo/${file.modelId}/list/${file.id}`);

    switch (file.modelType) {
      case 'providers': {
        modelDoc = this.afs.doc(`providers/${model.userId}/list/${model.id}`);
        break;
      }
      case 'categories': {
        modelDoc = this.afs.doc(`categories/${model.providerId}/list/${model.id}`);
        break;
      }
      case 'products': {
        modelDoc = this.afs.doc(
          `products/${model.providerId}/list/${model.categoryId}/list/${model.id}`);

        break;
      }
      default:
        break;
    }

    // update old file (markAsPrincipal = false)
    collectionRef.get().pipe(
      map(query => query.docs.map(doc => {
        if (doc.exists) {
          doc.ref.update({ markAsPrincipal: false });
        }
      }))
    ).subscribe();

    // run transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(newFileDoc.ref).then(() => {
        // update new file (markAsPrincipal = true)
        t.update(newFileDoc.ref, { markAsPrincipal: true });
        // update provider url
        t.update(modelDoc.ref, {url: file.url });
      });
    });
  }

  removeFileInfo(file: FileInfo) {
    const fileInfoDoc = this.afs.doc(`filesinfo/${file.modelId}/list/${file.id}`);

    return this.afs.firestore.runTransaction(t => {
      return t.get(fileInfoDoc.ref).then(() => {
        t.delete(fileInfoDoc.ref);
        // delete file from firebase storage
        this.storage.storage.refFromURL(file.url).delete();
      });
    });
  }
}
