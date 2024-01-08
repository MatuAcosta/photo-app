import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs, limit, query, setDoc, startAfter } from '@angular/fire/firestore';
import { FirebaseStorage, Storage, StorageError, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { PictureDTO } from '../models/types';
import { DateService } from './date.service';
import { TopicService } from './topic.service';

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
  private lastVisible: any;
  private pictures: BehaviorSubject<PictureDTO[]> = new BehaviorSubject<PictureDTO[]>([]);
  public noMorePictures$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);   
  public pictures$ = this.pictures.asObservable();
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

  async getPictures (): Promise<any>{
    try {
      const limitQuery = 5;
      const queryPictures = this.lastVisible === undefined ? 
        query(collection(this.firestore, this.dbPictures), limit(limitQuery)) : 
        query(collection(this.firestore, this.dbPictures),startAfter(this.lastVisible), limit(limitQuery));
      const pictures = await getDocs(queryPictures);
      if (pictures.docChanges().length < limitQuery) {
         this.noMorePictures$.next(true);
      }
      const picturesArray: PictureDTO[] = [];
      pictures.forEach((picture: any) => {
        picturesArray.push(picture.data());
      });
      this.pictures.next([...this.pictures.getValue(), ...picturesArray]);
      this.lastVisible = pictures.docs[pictures.docs.length - 1];
    } catch (error) {
      return {
        error: true,
        data: error
      }
    }
  }


}
