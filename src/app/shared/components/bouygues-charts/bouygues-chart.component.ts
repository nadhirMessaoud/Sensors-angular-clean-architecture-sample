//#region Imports
import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { ChartSerieModel } from '@app/core/models/charts/charts.models';
import { SensorMeasureModel } from '@app/features/sensor/models/sensor.models';


declare const require;
// Modules highcharts
const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
More(Highcharts);
noData(Highcharts);

//#endregion

@Component({
    selector: 'bouygues-chart',
    templateUrl: './bouygues-chart.component.html',
    styleUrls: ['./bouygues-chart.component.scss']
})
export class BouyguesChartComponent implements OnChanges {
    //#region Inputs
    @Input() loading: boolean;
    @Input() noSensors: boolean = false;
    @Input() xAxis: Array<string>;
    @Input() series: SensorMeasureModel[];
    @Input() noDataMsg: string;
    @Input() chartTitle: string;
    @Input() isLegendEnabled: boolean;
    @Input() isMarkerEnabled: boolean;
    @Input() yAxisTitle: string;
    @Input() unit: string;
    //#endregion

    //#region Properties
    private options: Object = {};
    private chart: Chart;

    isFullScreenChart = false;
    //#endregion

    //#region constructor
    constructor() {
    }
    //#endregion

    /**
     * Update the chart with it's options
     */
    private updateChart(): void {
        const yaxis = [
            {
                title: {
                    text: this.yAxisTitle,
                    rotation: -90
                },
                opposite: false
            }
        ];

        this.options = {
            chart: {
                style: {
                    fontFamily: 'Roboto'
                }
            },
            plotOptions: {
                series: {
                    marker: { enabled: this.isMarkerEnabled, symbol: 'circle' },
                    connectNulls: true
                }
            },
            title: { text: this.chartTitle },
            legend: {
                enabled: this.isLegendEnabled
            },
            lang: {
                noData: this.noDataMsg ? this.noDataMsg : 'Ce graphique ne contient pas de données',
                contextButtonTitle: '',
                decimalPoint: ',',
                downloadPNG: 'Télécharger en PNG',
                downloadPDF: 'Télécharger en PDF',
                downloadJPEG: 'Télécharger en JPEG',
                downloadCSV: 'Télécharger en CSV',
                downloadSVG: 'Télécharger en SVG',
                viewFullscreen: 'Voir en mode plein écran',
                printChart: 'Imprimer la charte'
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                    fontSize: '10px',
                    color: '#303030'
                }
            },
            credits: { enabled: false },
            xAxis: {
                type: 'string',
                categories: this.xAxis ? this.xAxis : null,
                crosshair: {
                          width: 2,
                          color: 'black'
                      }
            },
            yAxis: yaxis,
            tooltip: {
                borderWidth: 0.5,
                style: {
                    fontFamily: 'Roboto',
                    fontSize: '12px'
                },
                shared: true
            },
            series: this.getMeasures(this.series),

            navigation: {
                buttonOptions: {
                    x: -60,
                    y: -12
                }
            },

            exporting: {
                buttons: {
                    contextButton: {}
                }
            }
        };

        // this.chart.update(this.options, true, true, true);
        this.chart = null;

        this.chart = Highcharts.chart('container',this.options);
    }

    /**
     * fetch sensor's measures to chart's serie values model
     * @param series data serie for sensor measures
     */
    getMeasures(series: SensorMeasureModel[]): Array<ChartSerieModel> {
        const mesures: Array<ChartSerieModel> = [];
        if (series && series.length > 0) {
            this.series.forEach(s => {
                mesures.push({
                    id: s.sensor.sensorId,
                    name: s.sensor.sensorLabel,
                    type: 'spline',
                    turboThreshold: 100000,
                    data: s.measures.map(m => m.measure),
                    zoneAxis: 'x',
                    yAxis: 0,
                    tooltip: {
                        valueSuffix: ' ' + this.unit
                    }
                });
            });
        }
        return mesures;
    }

    /**
     * Set the chart's loading message
     * @param customMessage custom message to show by the loading chart
     */
    showLoadingMessage(customMessage: string = 'Chargement des données ...') {
        this.chart.showLoading(customMessage);
    }

    /**
     * Hides the chart's loading message
     */
    hideLoadingMessage() {
        this.chart.hideLoading();
    }

    /**
     * Callback after each input's change
     * @param changes changes in BouyguesChartComponent component inputs 
     */
    ngOnChanges(changes: SimpleChanges): void {
        if (this.chart) {
            // handle loading message display
            if (changes.loading && changes.loading.currentValue) {
                this.showLoadingMessage();
            } else {
                this.hideLoadingMessage();
            }
        }
        setTimeout(() => this.updateChart(), 50);
    }

    /**
     * Switch FullScreen mode; on/off
     */
    onFullScreenToggle() {
        this.isFullScreenChart = !this.isFullScreenChart;
        if (this.chart) {
            this.chart.reflow();
        }
    }

    //#endregion
}
