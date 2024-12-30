import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private activePeriod: any;

  private periodSubject: BehaviorSubject<string> = new BehaviorSubject<string>('PERÍODO');
  public period$: Observable<string> = this.periodSubject.asObservable();

  private activePeriodSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public activePeriod$: Observable<any | null> = this.activePeriodSubject.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.loadActivePeriod();
  }

  private loadActivePeriod(): void {
    this.firestore.collection('period', ref => ref.where('status', '==', true)).valueChanges().pipe(
      map((period: any[]) => period.length > 0 ? period[0] : null),
      tap(period => this.activePeriodSubject.next(period))
    ).subscribe();
  }

  setActivePeriod(period: any): void {
    this.activePeriodSubject.next(period);
  }

  getActivePeriod(): Observable<any | null> {
    return this.activePeriod$;
  }

  getAllPeriods(): Observable<any[]> {
    return this.firestore.collection('period').valueChanges();
  }

  saveActivities(batch: any, generalData: any, activities: any[], type: string, periodID: string) {
    activities.forEach((activities: any) => {
      const newDocRef = this.firestore.collection('activities').doc().ref;
      batch.set(newDocRef, { id: newDocRef.id, ...generalData, ...activities, type, periodID: periodID });
    });
  }

  createPeriod(period: any): Promise<any> {
    const periodRef = this.firestore.collection('period').doc().ref;
    return periodRef.set({ ...period, id: periodRef.id });
  }

  getActivitiesByActivePeriod(type: string): Observable<any[]> {
    return this.getActivePeriod().pipe(
      switchMap(period => {
        if (period) {
          return this.firestore.collection('activities', ref => ref.where('periodID', '==', period.id).where('type', '==', type)).valueChanges();
        }
        return of([]);
      })
    );
  }

  
  

  
}