import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { FirebaseStorage, Storage, StorageError, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { PictureDTO } from '../models/types';
import { DateService } from './date.service';
import { TopicService } from './topic.service';
import { unsubscribe } from 'diagnostics_channel';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private firestore: Firestore = inject(Firestore);
  private storage: FirebaseStorage = inject(Storage);
  private dateService: DateService = inject(DateService);
  private topicService: TopicService = inject(TopicService);
  private uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private urlPicture: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private dbPictures: string = 'pictures';  
  public urlPicture$ = this.urlPicture.asObservable();
  public uploadProgress$ = this.uploadProgress.asObservable();

  constructor() { }

  uploadPictureToStorage(file: File, path: string): any{
    const storageRef = ref(this.storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
    (snapshot) => {
      this.uploadProgress.next((snapshot.bytesTransferred / snapshot.totalBytes) * 100);  
      console.log('Upload is ' + this.uploadProgress.getValue() + '% done');
    },
    (error: StorageError) => {
      console.log('error in uploadPicture', error);
      return {
        error: true,
        message: 'error uploading picture'
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => { 
        console.log('File available at', downloadURL);
        this.urlPicture.next(downloadURL);
        return {
          error: false,
          message: '',
          url: downloadURL
        }
      });
    })
  }
  async createPicture(url: string, username: string, description:string){
    try {
      const createdPicture = await setDoc(doc(this.firestore, this.dbPictures, username),{
        url,
        username,
        description,
        createdAt: this.dateService.todayDate.join('-'),
        likes: 0,
        topic: this.topicService.topicOfTheDay.topic
      });
      return {
        error: false,
        message: 'picture created'
      };
    } catch (error) {
      console.log('error createPicture', error)
      return {
        error: true, 
        message: ''
      }
    }
  }

  async getPictures (): Promise<{data: any, error: boolean}>{
    try {
      const pictures = await getDocs(collection(this.firestore, this.dbPictures));
      const picturesArray: PictureDTO[] = [];
      pictures.forEach((picture: any) => {
        picturesArray.push(picture.data());
      });
      return {
        error: false,
        data: picturesArray
      }
    } catch (error) {
      return {
        error: true,
        data: error
      }
    }
  }


}
