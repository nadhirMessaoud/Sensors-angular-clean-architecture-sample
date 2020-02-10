import { NgModule, ModuleWithProviders } from "@angular/core";
import { HttpClientModule} from "@angular/common/http";

import { BouyguesChartComponent } from './components/bouygues-charts/bouygues-chart.component';


@NgModule({
    imports: [
        HttpClientModule
    ],
    declarations: [
        BouyguesChartComponent
    ],
    exports: [ 
        BouyguesChartComponent
    ],
    entryComponents: [],
    providers: [HttpClientModule],
    schemas: []
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule
        };
    }
}