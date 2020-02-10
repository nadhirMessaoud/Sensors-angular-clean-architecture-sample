export interface ChartSerieModel {
    id?: number;
    name: string;
    type?: string;
    turboThreshold: number;
    dashStyle?: string;
    color?: string;
    data: Array<number>;
    zoneAxis?: string;
    zones?: Array<LoadCurveZone>;
    stickyTracking?: boolean;
    tooltip?: { valueSuffix: string };
    yAxis?: number;
}
