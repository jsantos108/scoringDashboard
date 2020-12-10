import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from "./app.component";
import { StarcalculatorComponent } from "./starcalculator/starcalculator.component";
import { DataService } from "./data.service";

@NgModule({
  declarations: [AppComponent, StarcalculatorComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
