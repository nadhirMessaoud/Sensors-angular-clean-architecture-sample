//#region Imports
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import * as Highcharts from 'highcharts';
import { Chart } from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);

import { ChartSerieModel } from '@app/core/models/charts/charts.models';
import { SensorMeasureModel } from '@app/features/sensor/models/sensor.models';


declare const require;

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
    @Input() noSensors: boolean;
    @Input() xAxis: Array<string>;
    @Input() series: SensorMeasureModel[];
    @Input() noDataMsg: string;
    @Input() chartTitle: string;
    @Input() isLegendEnabled: boolean;
    @Input() isMarkerEnabled: boolean;
    @Input() yAxisTitle: string;
    @Input() unit: string;
    @Output() mouseMove: EventEmitter<object> = new EventEmitter();

    @Output() public hiddenSeriesChanged = new EventEmitter<string[]>();
    private hiddenSeries: string[] = [];
    //#endregion

    //#region Properties
    private options: Object = {};

    private chart: Chart;
    private serieValue = [];

    cid: string;
    isFullScreenChart = false;
    fullscreenIcon =
        '<svg version="1.1" id="IconsRepoEditor" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 384.97 384.97" style="enable-background:new 0 0 384.97 384.97;" xml:space="preserve" width="16px" height="16px" fill="#000000" stroke="#000000" stroke-width="0"><g id="IconsRepo_bgCarrier"></g> <g id="IconsRepoEditor"> <path d="M384.97,12.03c0-6.713-5.317-12.03-12.03-12.03H264.847c-6.833,0-11.922,5.39-11.934,12.223 c0,6.821,5.101,11.838,11.934,11.838h96.062l-0.193,96.519c0,6.833,5.197,12.03,12.03,12.03c6.833-0.012,12.03-5.197,12.03-12.03 l0.193-108.369c0-0.036-0.012-0.06-0.012-0.084C384.958,12.09,384.97,12.066,384.97,12.03z"></path> <path d="M120.496,0H12.403c-0.036,0-0.06,0.012-0.096,0.012C12.283,0.012,12.247,0,12.223,0C5.51,0,0.192,5.317,0.192,12.03 L0,120.399c0,6.833,5.39,11.934,12.223,11.934c6.821,0,11.838-5.101,11.838-11.934l0.192-96.339h96.242 c6.833,0,12.03-5.197,12.03-12.03C132.514,5.197,127.317,0,120.496,0z"></path> <path d="M120.123,360.909H24.061v-96.242c0-6.833-5.197-12.03-12.03-12.03S0,257.833,0,264.667v108.092 c0,0.036,0.012,0.06,0.012,0.084c0,0.036-0.012,0.06-0.012,0.096c0,6.713,5.317,12.03,12.03,12.03h108.092 c6.833,0,11.922-5.39,11.934-12.223C132.057,365.926,126.956,360.909,120.123,360.909z"></path> <path d="M372.747,252.913c-6.833,0-11.85,5.101-11.838,11.934v96.062h-96.242c-6.833,0-12.03,5.197-12.03,12.03 s5.197,12.03,12.03,12.03h108.092c0.036,0,0.06-0.012,0.084-0.012c0.036-0.012,0.06,0.012,0.096,0.012 c6.713,0,12.03-5.317,12.03-12.03V264.847C384.97,258.014,379.58,252.913,372.747,252.913z"></path> </g></svg>';
    //#endregion

    //#region constructor
    constructor() {
        this.cid = new Date().getTime() + '';
    }
    //#endregion

    public onMouseMove(event) {
        this.mouseMove.emit(event);
    }

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
                },
                events: {
                    redraw: function() {
                        this.onRedraw();
                    }.bind(this)
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
        // the update not updating the zones coloration, so we create a new chart on data change
        // visual results are the same
        // todo: check for a solution to update colors with chart
        this.chart = null;

        this.chart = Highcharts.chart(this.cid, this.options);
    }

    onRedraw() {
        if (!this.hiddenSeries) {
            this.hiddenSeries = this.getHiddenSeries();
        }
        const ids = this.getHiddenSeries();
        if (JSON.stringify(ids.sort()) !== JSON.stringify(this.hiddenSeries)) {
            this.hiddenSeries = ids;
            // si la liste des séries modifiées est différentes on envoie l'évènement hiddenSeriesChanged
            this.hiddenSeriesChanged.emit(this.getHiddenSeries());
        }
    }

    getHiddenSeries(): string[] {
        if (this.chart && this.chart.series) {
            return this.chart.series.filter(s => !s.visible).map(o => o.options.id);
        } else {
            return [];
        }
    }

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

    showLoadingMessage(customMessage: string = 'Chargement des données ...') {
        this.chart.showLoading(customMessage);
    }

    hideLoadingMessage() {
        this.chart.hideLoading();
    }

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

    onFullScreenToggle() {
        this.isFullScreenChart = !this.isFullScreenChart;
        if (this.chart) {
            this.chart.reflow();
        }
    }

    //#endregion
}
