import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SensorModel, SensorMeasureModel } from '../../features/sensor/models/sensor.models';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChartDataService {

    sensorsMeasuresList: SensorMeasureModel[];
    sensorsList: SensorModel[];

    constructor(private http: HttpClient){

    }

   /**
    * Retournes la liste des capteurs
    */
   public getSensors(): Observable<SensorModel[]>{
        return this.http.get<SensorModel[]>('http://localhost:3004/sensors');
   }

      /**
    * Retournes les mesures des capteurs
    */
   public getSensorsMeasures(): Observable<SensorMeasureModel[]>{
        return this.http.get<SensorMeasureModel[]>('http://localhost:3004/sensorMeasures');
    // .subscribe(res => this.sensorsMeasuresList =
    // res.json() as SensorMeasureModel[]);
    }
}