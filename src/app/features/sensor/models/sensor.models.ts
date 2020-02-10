export class MeasureModel {
    sensorId: number;
    dateTime: Date;
    measure: number;
    constructor() {
        this.measure = 1;
        this.sensorId = null;
        this.dateTime = new Date();
    }
}

export class SensorMeasureTypeModel {
    measureType: string;
    measureTypeId: number;
    picto: string;
    mainUnit: string;
    secondaryUnits: string[];
    color: string;
    constructor() {
        this.measureType = '';
        this.measureTypeId = null;
        this.picto = '';
        this.color = '';
    }
}

export class SensorModel {
    sensorId: number;
    deviceId: number;
    sensorLabel: string;
    supplierId: string;
    sensorMeasureType: SensorMeasureTypeModel;
    unit: string;
    lastMeasureDate: Date;
    valid: boolean;
    update: boolean;
}

export class SensorMeasureModel {
    sensor: SensorModel;
    measures: MeasureModel[];
}