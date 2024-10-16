import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  private activePeriod: any;

  private periodoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('PERÍODO');
  public periodo$: Observable<string> = this.periodoSubject.asObservable();

  private activePeriodSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public activePeriod$: Observable<any | null> = this.activePeriodSubject.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.loadActivePeriod();
  }

  private loadActivePeriod(): void {
    this.firestore.collection('periodos', ref => ref.where('activo', '==', true)).valueChanges().pipe(
      map((periodos: any[]) => periodos.length > 0 ? periodos[0] : null),
      tap(periodo => this.activePeriodSubject.next(periodo))
    ).subscribe();
  }

  setActivePeriod(periodo: any): void {
    this.activePeriodSubject.next(periodo);
  }

  getActivePeriod(): Observable<any | null> {
    return this.activePeriod$;
  }





  getAllPeriods(): Observable<any[]> {
    return this.firestore.collection('periodos').valueChanges();
  }

  saveActivities(batch: any, generalData: any, items: any[], tipo: string, periodId: string) {
    items.forEach((item: any) => {
      const newDocRef = this.firestore.collection('items').doc().ref;
      batch.set(newDocRef, { id: newDocRef.id, ...generalData, ...item, tipo, periodoId: periodId });
    });
  }

  createPeriod(periodo: any): Promise<any> {
    const periodRef = this.firestore.collection('periodos').doc().ref;
    return periodRef.set({ ...periodo, id: periodRef.id });
  }

  getActivitiesByActivePeriod(tipo: string): Observable<any[]> {
    return this.getActivePeriod().pipe(
      switchMap(periodo => {
        if (periodo) {
          return this.firestore.collection('items', ref => ref.where('periodoId', '==', periodo.id).where('tipo', '==', tipo)).valueChanges();
        }
        return of([]);
      })
    );
  }
}