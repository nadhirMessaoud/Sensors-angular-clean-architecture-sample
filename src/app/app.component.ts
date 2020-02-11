import { Component, ViewChild, OnInit } from '@angular/core';

import { BouyguesChartComponent } from '@app/shared/components/bouygues-charts/bouygues-chart.component';
import { SensorMeasureModel } from '@app/features/sensor/models/sensor.models';
import { ChartDataService } from '@app/core/http/charts.service';
import { SensorModel } from './features/sensor/models/sensor.models';

@Component({
  selector: 'ns-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'SensorsSampleApp';

  loading = true;
  noSensors = false;
  xAxis: Array<string>;
  series: SensorMeasureModel[];
  noDataMsg: string = "No data msg";
  chartTitle: string = "Titre de la charte";
  isLegendEnabled: boolean = true;
  isMarkerEnabled: boolean = false;
  yAxisTitle = 'Pression';
  unit = '';

  sensor: SensorModel;

  constructor(private chartDataService: ChartDataService){}

  ngOnInit(): void {
    // Calling ChartDataService to get the sensor's informations
    this.chartDataService.getSensors().subscribe(res => {
      this.sensor = res[0];
      this.unit = this.sensor.unit;
      this.yAxisTitle = this.sensor.sensorMeasureType.measureType;
    });  
    // Calling ChartDataService to feed the chart by sensor's mesures
    this.chartDataService.getSensorsMeasures().subscribe(res => {
      this.series = res;
    });  
  }

}
