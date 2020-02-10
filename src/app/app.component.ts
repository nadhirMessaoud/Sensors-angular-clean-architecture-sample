import { Component, ViewChild } from '@angular/core';

import { BouyguesChartComponent } from '@app/shared/components/bouygues-charts/bouygues-chart.component';
import { SensorMeasureModel } from '@app/features/sensor/models/sensor.models';
import { ChartDataService } from '@app/core/http/charts.service';

@Component({
  selector: 'ns-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
  unit = 'bar';

  @ViewChild(BouyguesChartComponent, { static: false }) bouyguesChart;

  constructor(private chartDataService: ChartDataService){
    this.chartDataService.getSensorsMeasures().subscribe(res => {
      console.log('resultats');
      console.log(res);
      this.series = res;
    });
  }
  
}
