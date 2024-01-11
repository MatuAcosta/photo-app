import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDocs,  orderBy, query, setDoc,  updateDoc } from '@angular/fire/firestore';
import { FirebaseStorage, Storage, StorageError, getDownloadURL, ref, uploadBytesResumable } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';
import { PictureDTO } from '../models/types';
import { DateService } from './date.service';
import { TopicService } from './topic.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PictureService {
  private firestore: Firestore = inject(Firestore);
  private storage: FirebaseStorage = inject(Storage);
  private dateService: DateService = inject(DateService);
  private topicService: TopicService = inject(TopicService);
  private userService: UserService = inject(UserService);
  private uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private urlPicture: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private dbPictures: string = 'pictures';  
  private pictures: BehaviorSubject<PictureDTO[]> = new BehaviorSubject<PictureDTO[]>([]);
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
      //console.log('Upload is ' + this.uploadProgress.getValue() + '% done');
    },
    (error: StorageError) => {
      //console.log('error in uploadPicture', error);
      return {
        error: true,
        message: 'error uploading picture'
      }
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => { 
        //console.log('File available at', downloadURL);
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
      await setDoc(doc(this.firestore, this.dbPictures, username),{
        url,
        username,
        description,
        createdAt: this.dateService.todayDate.join('-'),
        time: this.dateService.today.getTime(),
        likes: [],
        topic: this.topicService.topicOfTheDay.topic
      });
      this.setUrl('');
      return {
        error: false,
        message: 'Picture uploaded successfully'
      };
    } catch (error) {
      //console.log('error createPicture', error)
      return {
        error: true, 
        message: ''
      }
    }
  }

  setUrl(url: string){
    this.urlPicture.next(url);
  }

  async getPictures (): Promise<any>{
    try {
      const queryPictures =  query(collection(this.firestore, this.dbPictures), orderBy('time', 'desc')); 
      const pictures: any = await getDocs(queryPictures);
      let picturesArray: PictureDTO[] = [];
      pictures.forEach((picture: any) => {        
        picturesArray.push(picture.data());
      });
      picturesArray = picturesArray.filter((picture: PictureDTO) => picture.topic === this.topicService.topicOfTheDay.topic);
      this.pictures.next(picturesArray);
    } catch (error) {
      //console.log('error pictures', error);
      return {
        error: true,
        data: error
      }
    }
  }

  async likePicture(username: string, likes: string[]) {
    try {    
      const pictureRef = doc(this.firestore, this.dbPictures, username);
      await updateDoc(pictureRef, {
        likes
      })
    } catch (error) {
      
    } 
    finally{
    }
  }

}
