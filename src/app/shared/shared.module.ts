import { NgModule, ModuleWithProviders } from "@angular/core";

import { BouyguesChartComponent } from './components/bouygues-charts/bouygues-chart.component';


@NgModule({
    imports: [
        
    ],
    declarations: [
        BouyguesChartComponent
    ],
    exports: [ 
        BouyguesChartComponent
    ],
    entryComponents: [],
    providers: [],
    schemas: []
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}