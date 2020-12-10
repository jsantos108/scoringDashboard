import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
declare var $: any;

@Component({
  selector: "app-starcalculator",
  templateUrl: "./starcalculator.component.html",
  styleUrls: ["./starcalculator.component.css"]
})
export class StarcalculatorComponent implements OnInit {
  public esAcadAchievMax: number = 25;
  public AcadAchievGaugeValue: number = 0;
  public esGrowthMax: number = 35;
  public growthGaugeValue: number = 0;
  public esElaProfMax: number = 10;
  public ElaProfGaugeValue: number = 0;
  public esOppGapMax: number = 20;
  public OppGapGaugeValue: number = 0;
  public esEngageMax: number = 10;
  public engageGaugeValue: number = 0;
  public msAcadAchievMax: number = 25;
  public msGrowthMax: number = 30;
  public msElaProfMax: number = 10;
  public msOppGapMax: number = 20;
  public msEngageMax: number = 15;
  public hsAcadAchievMax: number = 25;
  public hsGradRateMax: number = 30;
  public gradRateGaugeValue: number = 0;
  public hsElaProfMax: number = 10;
  public hsReadinessMax: number = 25;
  public readinessGaugeValue: number = 0;
  public hsEngageMax: number = 10;
  public starWidth: number = 0;
  public starTotal: number = 0;
  public pointTotal: number = 0;
  public schoolLevelSelect;
  public pooled: number = 0;
  public pooledMath: number = 0;
  public pooledELA: number = 0;
  public pooledScience: number = 0;
  public ELA: number = 0;
  public ccrMath: number = 0;
  public ccrELA: number = 0;
  public hsScience: number = 0;
  public mMGP: number = 0;
  public eMGP: number = 0;
  public mAGP: number = 0;
  public eAGP: number = 0;
  public fourACGR: number = 0;
  public fiveACGR: number = 0;
  public wida: number = 0;
  public mGAP: number = 0;
  public eGAP: number = 0;
  public chronAb: number = 0;
  public prePART: number = 0;
  public preCOMP: number = 0;
  public diploma: number = 0;
  public nacCredReqs: number = 0;
  public aLrnPlan: number = 0;
  public credSuff: number = 0;

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    $(".holdInput").each(function () {
      $(this).attr("readOnly", "true");
    });
    this.dataservice.getLocations().subscribe((data) => {
      $("#schoolID").text(data.building);
      this.preloadForm(data);
    });
  }

  formSetup(e) {
    this.schoolLevelSelect = e.target.value;
    if (this.schoolLevelSelect === "ES") {
      this.showEsInputs();
    }
    if (this.schoolLevelSelect === "MS") {
      this.showMsInputs();
    }
    if (this.schoolLevelSelect === "HS") {
      this.showHsInputs();
    }
  }
  /*


  After clicking "Calculate", build all dashboard elements
  
  
  */
  buildDash() {
    event.preventDefault();
    this.pointTotal = 0;
    this.starWidth = 0;
    this.starTotal = 0;
    this.AcadAchievGaugeValue = 0;
    this.growthGaugeValue = 0;
    this.ElaProfGaugeValue = 0;
    this.OppGapGaugeValue = 0;
    this.engageGaugeValue = 0;
    this.pooledMath = Number($("#pooledMath").val());

    this.pooledELA = Number($("#pooledELA").val());
    this.pooledScience = Number($("#pooledScience").val());
    if ($("#crtPooledProficiency")[0].hasAttribute("readonly")) {
      this.pooled = this.pooledMath + this.pooledELA + this.pooledScience;
    } else {
      this.pooled = Number($("#crtPooledProficiency").val());
    }
    this.ELA = Number($("#elaProficiency").val());
    this.ccrMath = Number($("#ccrMath").val());
    this.ccrELA = Number($("#ccrELA").val());
    this.hsScience = Number($("#hsScience").val());
    this.mMGP = Number($("#mathCRTmgp").val());
    this.eMGP = Number($("#elaCRTmgp").val());
    this.mAGP = Number($("#mathCRTagp").val());
    this.eAGP = Number($("#elaCRTagp").val());
    this.fourACGR = Number($("#4yrACGR").val());
    this.fiveACGR = Number($("#5yrACGR").val());
    this.wida = Number($("#WIDAagp").val());
    this.mGAP = Number($("#mathGAP").val());
    this.eGAP = Number($("#elaGAP").val());
    this.prePART = Number($("#prepPart").val());
    this.preCOMP = Number($("#prepComp").val());
    this.diploma = Number($("#diploma").val());
    this.nacCredReqs = Number($("#nacCrdRqs").val());
    this.aLrnPlan = Number($("#acadLrnPlan").val());
    this.credSuff = Number($("#crdSuff").val());
    if (Number($("#chronAbsent").val()) < 24) {
      this.chronAb = Number($("#chronAbsent").val());
    } else {
      this.chronAb = 24;
    }

    this.getPoints();
    this.getStars();
    this.starWidth = this.starTotal * 20;
    $("#pointsView")[0].innerHTML = this.pointTotal;
    $(".stars-inner")[0].style.width = `${this.starWidth}%`;
    for (let i = 0; i < $(".gauge").length; i++) {
      $(".gauge")[i].style.display = "none";
    }
    $("#chartRow")[0].style.display = "none";
    this.makeGauges();
    this.makeLineChart();
  }

  //Preload Form with User's School Data

  preloadForm(data) {
    $("#crtPooledProficiency").val(
      data.CRT_Perc_MA_Pro + data.CRT_Perc_ELA_Pro + data.CRT_Perc_SCIE_Pro
    );
    $("#pooledMath").val(data.CRT_Perc_MA_Pro);
    $("#pooledELA").val(data.CRT_Perc_ELA_Pro);
    $("#pooledScience").val(data.CRT_Perc_SCIE_Pro);
    $("#elaProficiency").val(data.CRT_Perc_ELA_Pro_ReadBy3);
    $("#ccrMath").val(data.HS_Perc_MA_Pro);
    $("#ccrELA").val(data.HS_Perc_ELA_Pro);
    $("#hsScience").val(data.HSScience_Perc_Pro);
    $("#mathCRTmgp").val(data.Measure_MA_MGP);
    $("#elaCRTmgp").val(data.Measure_ELA_MGP);
    $("#mathCRTagp").val(data.Perc_MA_AGP);
    $("#elaCRTagp").val(data.Perc_ELA_AGP);
    $("#4yrACGR").val(data.Perc_Cohort_4Yr);
    $("#5yrACGR").val(data.Perc_Cohort_5Yr);
    $("#WIDAagp").val(data.Perc_WIDA_AGP);
    $("#mathGAP").val(data.Perc_MA_Gap);
    $("#elaGAP").val(data.Perc_ELA_Gap);
    $("#prepPart").val(data.CCR_Perc_PT);
    $("#prepComp").val(data.CCR_Perc_Completion);
    $("#diploma").val(data.CCR_Perc_AdvDip);
    $("#diploma").val(data.CCR_Perc_AdvDip);
    $("#chronAbsent").val(data.Perc_ChronicAbst);
    $("#nacCrdRqs").val(data.Perc_NAC);
    $("#acadLrnPlan").val(data.Perc_AcadLearn);
    $("#crdSuff").val(data.Perc_Gr9Suff);
  }

  // *************** Only show HS Inputs*****************

  showHsInputs() {
    $(".msInput").each(function () {
      $(this).css("display", "none");
    });
    $(".esInput").each(function () {
      $(this).css("display", "none");
    });
    $(".hsInput").each(function () {
      $(this).css("display", "block");
      $(this).removeAttr("readonly");
    });
    $(".pooledInput").each(function () {
      $(this).attr("display", "none");
    });
    $(".calcBtn").each(function () {
      $(this).removeAttr("disabled");
    });
  }

  // *************** Only show MS Inputs*****************

  showMsInputs() {
    $(".hsInput").each(function () {
      $(this).css("display", "none");
    });
    $(".esInput").each(function () {
      $(this).css("display", "none");
    });
    $(".msInput").each(function () {
      $(this).css("display", "block");
      $(this).removeAttr("readonly");
    });
    $(".pooledInput").each(function () {
      $(this).css("display", "none");
    });
    $(".calcBtn").each(function () {
      $(this).removeAttr("disabled");
    });
    $("#pooledMenuButton").attr("class", "fas fa-angle-double-down");
  }

  // *************** Only show ES Inputs*****************

  showEsInputs() {
    $(".hsInput").each(function () {
      $(this).css("display", "none");
    });
    $(".msInput").each(function () {
      $(this).css("display", "none");
    });
    $(".esInput").each(function () {
      $(this).css("display", "block");
      $(this).removeAttr("readonly");
    });
    $(".pooledInput").each(function () {
      $(this).css("display", "none");
    });
    $(".calcBtn").each(function () {
      $(this).removeAttr("disabled");
    });
    $("#pooledMenuButton").attr("class", "fas fa-angle-double-down");
  }

  //  *****************  Toggle Pooled Inputs****************

  togglePooledInputs() {
    $(".pooledInput").each(function () {
      if ($(this).css("display") === "none") {
        $(this).css("display", "block");
      } else {
        $(this).css("display", "none");
      }
    });
    if ($("#crtPooledProficiency")[0].hasAttribute("readonly")) {
      $("#crtPooledProficiency")[0].removeAttribute("readonly");
      $("#pooledMenuButton")[0].setAttribute(
        "class",
        "fas fa-angle-double-down"
      );
    } else {
      $("#crtPooledProficiency")[0].setAttribute("readonly", "true");
      $("#pooledMenuButton")[0].setAttribute("class", "fas fa-angle-double-up");
    }
  }

  //  *****************  Calculate High School Points****************

  hsPoints() {
    //  *****************  HS CCR Math Points****************
    if (this.ccrMath >= 42.4) {
      this.pointTotal += 10;
      this.AcadAchievGaugeValue += 10;
    } else if (this.ccrMath < 42.4 && this.ccrMath >= 41.1) {
      this.pointTotal += 9.5;
      this.AcadAchievGaugeValue += 9.5;
    } else if (this.ccrMath < 41.1 && this.ccrMath >= 39.7) {
      this.pointTotal += 9;
      this.AcadAchievGaugeValue += 9;
    } else if (this.ccrMath < 39.7 && this.ccrMath >= 38.4) {
      this.pointTotal += 8.5;
      this.AcadAchievGaugeValue += 8.5;
    } else if (this.ccrMath < 38.4 && this.ccrMath >= 37) {
      this.pointTotal += 8;
      this.AcadAchievGaugeValue += 8;
    } else if (this.ccrMath < 37 && this.ccrMath >= 35.7) {
      this.pointTotal += 7.5;
      this.AcadAchievGaugeValue += 7.5;
    } else if (this.ccrMath < 35.7 && this.ccrMath >= 34.3) {
      this.pointTotal += 7;
      this.AcadAchievGaugeValue += 7;
    } else if (this.ccrMath < 34.3 && this.ccrMath >= 33) {
      this.pointTotal += 6.5;
      this.AcadAchievGaugeValue += 6.5;
    } else if (this.ccrMath < 33 && this.ccrMath >= 31.6) {
      this.pointTotal += 6;
      this.AcadAchievGaugeValue += 6;
    } else if (this.ccrMath < 31.6 && this.ccrMath >= 30.3) {
      this.pointTotal += 5.5;
      this.AcadAchievGaugeValue += 5.5;
    } else if (this.ccrMath < 30.3 && this.ccrMath >= 28.3) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.ccrMath < 28.3 && this.ccrMath >= 25.3) {
      this.pointTotal += 4.5;
      this.AcadAchievGaugeValue += 4.5;
    } else if (this.ccrMath < 25.3 && this.ccrMath >= 22.4) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.ccrMath < 22.4 && this.ccrMath >= 19.4) {
      this.pointTotal += 3.5;
      this.AcadAchievGaugeValue += 3.5;
    } else if (this.ccrMath < 19.4 && this.ccrMath >= 16.5) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.ccrMath < 16.5 && this.ccrMath >= 13.5) {
      this.pointTotal += 2.5;
      this.AcadAchievGaugeValue += 2.5;
    } else if (this.ccrMath < 13.5 && this.ccrMath >= 10.6) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.ccrMath < 10.6 && this.ccrMath >= 7.6) {
      this.pointTotal += 1.5;
      this.AcadAchievGaugeValue += 1.5;
    } else if (this.ccrMath < 7.6 && this.ccrMath >= 4.7) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    } else if (this.ccrMath < 4.7) {
      this.pointTotal += 0.5;
      this.AcadAchievGaugeValue += 0.5;
    }
    //  *****************  HS CCR ELA Points****************
    if (this.ccrELA >= 55.9) {
      this.pointTotal += 10;
      this.AcadAchievGaugeValue += 10;
    } else if (this.ccrELA < 55.9 && this.ccrELA >= 54.9) {
      this.pointTotal += 9.5;
      this.AcadAchievGaugeValue += 9.5;
    } else if (this.ccrELA < 54.9 && this.ccrELA >= 53.9) {
      this.pointTotal += 9;
      this.AcadAchievGaugeValue += 9;
    } else if (this.ccrELA < 53.9 && this.ccrELA >= 52.9) {
      this.pointTotal += 8.5;
      this.AcadAchievGaugeValue += 8.5;
    } else if (this.ccrELA < 52.9 && this.ccrELA >= 51.9) {
      this.pointTotal += 8;
      this.AcadAchievGaugeValue += 8;
    } else if (this.ccrELA < 51.9 && this.ccrELA >= 50.9) {
      this.pointTotal += 7.5;
      this.AcadAchievGaugeValue += 7.5;
    } else if (this.ccrELA < 50.9 && this.ccrELA >= 49.8) {
      this.pointTotal += 7;
      this.AcadAchievGaugeValue += 7;
    } else if (this.ccrELA < 49.8 && this.ccrELA >= 48.8) {
      this.pointTotal += 6.5;
      this.AcadAchievGaugeValue += 6.5;
    } else if (this.ccrELA < 48.8 && this.ccrELA >= 47.8) {
      this.pointTotal += 6;
      this.AcadAchievGaugeValue += 6;
    } else if (this.ccrELA < 47.8 && this.ccrELA >= 46.8) {
      this.pointTotal += 5.5;
      this.AcadAchievGaugeValue += 5.5;
    } else if (this.ccrELA < 46.8 && this.ccrELA >= 44.8) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.ccrELA < 44.8 && this.ccrELA >= 44.1) {
      this.pointTotal += 4.5;
      this.AcadAchievGaugeValue += 4.5;
    } else if (this.ccrELA < 44.1 && this.ccrELA >= 37.3) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.ccrELA < 37.3 && this.ccrELA >= 33.5) {
      this.pointTotal += 3.5;
      this.AcadAchievGaugeValue += 3.5;
    } else if (this.ccrELA < 33.5 && this.ccrELA >= 29.8) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.ccrELA < 29.8 && this.ccrELA >= 26) {
      this.pointTotal += 2.5;
      this.AcadAchievGaugeValue += 2.5;
    } else if (this.ccrELA < 26 && this.ccrELA >= 22.2) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.ccrELA < 22.2 && this.ccrELA >= 18.4) {
      this.pointTotal += 1.5;
      this.AcadAchievGaugeValue += 1.5;
    } else if (this.ccrELA < 18.4 && this.ccrELA >= 14.7) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    } else if (this.ccrELA < 14.7) {
      this.pointTotal += 0.5;
      this.AcadAchievGaugeValue += 0.5;
    }
    //  *****************  HS Nevada High School Science Points****************
    if (this.hsScience >= 54.3) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.hsScience < 54.3 && this.hsScience >= 49) {
      this.pointTotal += 4.5;
      this.AcadAchievGaugeValue += 4.5;
    } else if (this.hsScience < 49 && this.hsScience >= 43.7) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.hsScience < 43.7 && this.hsScience >= 38.4) {
      this.pointTotal += 3.5;
      this.AcadAchievGaugeValue += 3.5;
    } else if (this.hsScience < 38.4 && this.hsScience >= 33.1) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.hsScience < 33.1 && this.hsScience >= 29.3) {
      this.pointTotal += 2.5;
      this.AcadAchievGaugeValue += 2.5;
    } else if (this.hsScience < 29.3 && this.hsScience >= 25.5) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.hsScience < 25.5 && this.hsScience >= 21.7) {
      this.pointTotal += 1.5;
      this.AcadAchievGaugeValue += 1.5;
    } else if (this.hsScience < 21.7 && this.hsScience >= 17.9) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    } else if (this.hsScience < 17.9) {
      this.pointTotal += 0.5;
      this.AcadAchievGaugeValue += 0.5;
    }
    //  *****************  HS 4-Year ACGR Points****************
    if (this.fourACGR >= 89.4) {
      this.pointTotal += 25;
      this.gradRateGaugeValue += 25;
    } else if (this.fourACGR < 54.3 && this.fourACGR >= 88.7) {
      this.pointTotal += 24;
      this.gradRateGaugeValue += 24;
    } else if (this.fourACGR < 88.7 && this.fourACGR >= 87.9) {
      this.pointTotal += 23;
      this.gradRateGaugeValue += 23;
    } else if (this.fourACGR < 87.9 && this.fourACGR >= 87.2) {
      this.pointTotal += 22;
      this.gradRateGaugeValue += 22;
    } else if (this.fourACGR < 87.2 && this.fourACGR >= 86.4) {
      this.pointTotal += 21;
      this.gradRateGaugeValue += 21;
    } else if (this.fourACGR < 86.4 && this.fourACGR >= 85.7) {
      this.pointTotal += 20;
      this.gradRateGaugeValue += 20;
    } else if (this.fourACGR < 85.7 && this.fourACGR >= 84.9) {
      this.pointTotal += 19;
      this.gradRateGaugeValue += 19;
    } else if (this.fourACGR < 84.9 && this.fourACGR >= 84.2) {
      this.pointTotal += 18;
      this.gradRateGaugeValue += 18;
    } else if (this.fourACGR < 84.2 && this.fourACGR >= 83.4) {
      this.pointTotal += 17;
      this.gradRateGaugeValue += 17;
    } else if (this.fourACGR < 83.4 && this.fourACGR >= 82.7) {
      this.pointTotal += 16;
      this.gradRateGaugeValue += 16;
    } else if (this.fourACGR < 82.7 && this.fourACGR >= 81.9) {
      this.pointTotal += 15;
      this.gradRateGaugeValue += 15;
    } else if (this.fourACGR < 81.9 && this.fourACGR >= 81.2) {
      this.pointTotal += 14;
      this.gradRateGaugeValue += 14;
    } else if (this.fourACGR < 81.2 && this.fourACGR >= 80.4) {
      this.pointTotal += 13;
      this.gradRateGaugeValue += 13;
    } else if (this.fourACGR < 80.4 && this.fourACGR >= 79.3) {
      this.pointTotal += 12;
      this.gradRateGaugeValue += 12;
    } else if (this.fourACGR < 79.3 && this.fourACGR >= 78.2) {
      this.pointTotal += 11;
      this.gradRateGaugeValue += 11;
    } else if (this.fourACGR < 78.2 && this.fourACGR >= 77.1) {
      this.pointTotal += 10;
      this.gradRateGaugeValue += 10;
    } else if (this.fourACGR < 77.1 && this.fourACGR >= 75.9) {
      this.pointTotal += 9;
      this.gradRateGaugeValue += 9;
    } else if (this.fourACGR < 75.9 && this.fourACGR >= 74.8) {
      this.pointTotal += 8;
      this.gradRateGaugeValue += 8;
    } else if (this.fourACGR < 74.8 && this.fourACGR >= 73.7) {
      this.pointTotal += 7;
      this.gradRateGaugeValue += 7;
    } else if (this.fourACGR < 73.7 && this.fourACGR >= 72.6) {
      this.pointTotal += 6;
      this.gradRateGaugeValue += 6;
    } else if (this.fourACGR < 72.6 && this.fourACGR >= 71.5) {
      this.pointTotal += 5;
      this.gradRateGaugeValue += 5;
    } else if (this.fourACGR < 71.5 && this.fourACGR >= 70.4) {
      this.pointTotal += 4;
      this.gradRateGaugeValue += 4;
    } else if (this.fourACGR < 70.4 && this.fourACGR >= 69.3) {
      this.pointTotal += 3;
      this.gradRateGaugeValue += 3;
    } else if (this.fourACGR < 69.3 && this.fourACGR >= 68.1) {
      this.pointTotal += 2;
      this.gradRateGaugeValue += 2;
    } else if (this.fourACGR < 68.1 && this.fourACGR >= 67) {
      this.pointTotal += 1;
      this.gradRateGaugeValue += 1;
    } else if (this.fourACGR < 67) {
      this.pointTotal += 0;
      this.gradRateGaugeValue += 0;
    }
    //  *****************  HS 5-Year ACGR Points****************
    if (this.fiveACGR >= 91.4) {
      this.pointTotal += 5;
      this.gradRateGaugeValue += 5;
    } else if (this.fiveACGR < 91.4 && this.fiveACGR >= 85.3) {
      this.pointTotal += 4;
      this.gradRateGaugeValue += 4;
    } else if (this.fiveACGR < 85.3 && this.fiveACGR >= 79.2) {
      this.pointTotal += 3;
      this.gradRateGaugeValue += 3;
    } else if (this.fiveACGR < 79.2 && this.fiveACGR >= 73.1) {
      this.pointTotal += 2;
      this.gradRateGaugeValue += 2;
    } else if (this.fiveACGR < 73.1 && this.fiveACGR >= 67) {
      this.pointTotal += 1;
      this.gradRateGaugeValue += 1;
    } else if (this.fiveACGR < 67) {
      this.pointTotal += 0;
      this.gradRateGaugeValue += 0;
    }
    //  *****************  HS WIDA Points****************
    if (this.wida >= 20) {
      this.pointTotal += 10;
      this.ElaProfGaugeValue += 10;
    } else if (this.wida < 20 && this.wida >= 18) {
      this.pointTotal += 9;
      this.ElaProfGaugeValue += 9;
    } else if (this.wida < 18 && this.wida >= 15) {
      this.pointTotal += 8;
      this.ElaProfGaugeValue += 8;
    } else if (this.wida < 15 && this.wida >= 12) {
      this.pointTotal += 7;
      this.ElaProfGaugeValue += 7;
    } else if (this.wida < 12 && this.wida >= 10) {
      this.pointTotal += 6;
      this.ElaProfGaugeValue += 6;
    } else if (this.wida < 10 && this.wida >= 8) {
      this.pointTotal += 5;
      this.ElaProfGaugeValue += 5;
    } else if (this.wida < 8 && this.wida >= 7) {
      this.pointTotal += 4;
      this.ElaProfGaugeValue += 4;
    } else if (this.wida < 7 && this.wida >= 6) {
      this.pointTotal += 3;
      this.ElaProfGaugeValue += 3;
    } else if (this.wida < 6 && this.wida >= 5) {
      this.pointTotal += 2;
      this.ElaProfGaugeValue += 2;
    } else if (this.wida < 5) {
      this.pointTotal += 1;
      this.ElaProfGaugeValue += 1;
    }
    //  *****************  HS College Prep Participation Points****************
    if (this.prePART >= 74.5) {
      this.pointTotal += 10;
      this.readinessGaugeValue += 10;
    } else if (this.prePART < 74.5 && this.prePART >= 73) {
      this.pointTotal += 9.5;
      this.readinessGaugeValue += 9.5;
    } else if (this.prePART < 73 && this.prePART >= 71.4) {
      this.pointTotal += 9;
      this.readinessGaugeValue += 9;
    } else if (this.prePART < 71.4 && this.prePART >= 69.9) {
      this.pointTotal += 8.5;
      this.readinessGaugeValue += 8.5;
    } else if (this.prePART < 69.9 && this.prePART >= 68.3) {
      this.pointTotal += 8;
      this.readinessGaugeValue += 8;
    } else if (this.prePART < 68.3 && this.prePART >= 66.8) {
      this.pointTotal += 7.5;
      this.readinessGaugeValue += 7.5;
    } else if (this.prePART < 66.8 && this.prePART >= 65.2) {
      this.pointTotal += 7;
      this.readinessGaugeValue += 7;
    } else if (this.prePART < 65.2 && this.prePART >= 63.7) {
      this.pointTotal += 6.5;
      this.readinessGaugeValue += 6.5;
    } else if (this.prePART < 63.7 && this.prePART >= 62.1) {
      this.pointTotal += 6;
      this.readinessGaugeValue += 6;
    } else if (this.prePART < 62.1 && this.prePART >= 60.6) {
      this.pointTotal += 5.5;
      this.readinessGaugeValue += 5.5;
    } else if (this.prePART < 60.6 && this.prePART >= 59) {
      this.pointTotal += 5;
      this.readinessGaugeValue += 5;
    } else if (this.prePART < 59 && this.prePART >= 57.5) {
      this.pointTotal += 4.5;
      this.readinessGaugeValue += 4.5;
    } else if (this.prePART < 57.5 && this.prePART >= 55.9) {
      this.pointTotal += 4;
      this.readinessGaugeValue += 4;
    } else if (this.prePART < 55.9 && this.prePART >= 54.4) {
      this.pointTotal += 3.5;
      this.readinessGaugeValue += 3.5;
    } else if (this.prePART < 54.4 && this.prePART >= 52.8) {
      this.pointTotal += 3;
      this.readinessGaugeValue += 3;
    } else if (this.prePART < 52.8 && this.prePART >= 51.3) {
      this.pointTotal += 2.5;
      this.readinessGaugeValue += 2.5;
    } else if (this.prePART < 51.3 && this.prePART >= 49.7) {
      this.pointTotal += 2;
      this.readinessGaugeValue += 2;
    } else if (this.prePART < 49.7 && this.prePART >= 48.2) {
      this.pointTotal += 1.5;
      this.readinessGaugeValue += 1.5;
    } else if (this.prePART < 48.2 && this.prePART >= 46.6) {
      this.pointTotal += 1;
      this.readinessGaugeValue += 1;
    } else if (this.prePART < 46.6) {
      this.pointTotal += 0.5;
      this.readinessGaugeValue += 0.5;
    }
    //  *****************  HS College Prep Completion Points****************
    if (this.preCOMP >= 55.8) {
      this.pointTotal += 10;
      this.readinessGaugeValue += 10;
    } else if (this.preCOMP < 55.8 && this.preCOMP >= 53) {
      this.pointTotal += 9.5;
      this.readinessGaugeValue += 9.5;
    } else if (this.preCOMP < 53 && this.preCOMP >= 50.1) {
      this.pointTotal += 9;
      this.readinessGaugeValue += 9;
    } else if (this.preCOMP < 50.1 && this.preCOMP >= 47.3) {
      this.pointTotal += 8.5;
      this.readinessGaugeValue += 8.5;
    } else if (this.preCOMP < 47.3 && this.preCOMP >= 44.4) {
      this.pointTotal += 8;
      this.readinessGaugeValue += 8;
    } else if (this.preCOMP < 44.4 && this.preCOMP >= 41.6) {
      this.pointTotal += 7.5;
      this.readinessGaugeValue += 7.5;
    } else if (this.preCOMP < 41.6 && this.preCOMP >= 38.7) {
      this.pointTotal += 7;
      this.readinessGaugeValue += 7;
    } else if (this.preCOMP < 38.7 && this.preCOMP >= 35.9) {
      this.pointTotal += 6.5;
      this.readinessGaugeValue += 6.5;
    } else if (this.preCOMP < 35.9 && this.preCOMP >= 33) {
      this.pointTotal += 6;
      this.readinessGaugeValue += 6;
    } else if (this.preCOMP < 33 && this.preCOMP >= 30.2) {
      this.pointTotal += 5.5;
      this.readinessGaugeValue += 5.5;
    } else if (this.preCOMP < 30.2 && this.preCOMP >= 27.3) {
      this.pointTotal += 5;
      this.readinessGaugeValue += 5;
    } else if (this.preCOMP < 27.3 && this.preCOMP >= 24.5) {
      this.pointTotal += 4.5;
      this.readinessGaugeValue += 4.5;
    } else if (this.preCOMP < 24.5 && this.preCOMP >= 21.6) {
      this.pointTotal += 4;
      this.readinessGaugeValue += 4;
    } else if (this.preCOMP < 21.6 && this.preCOMP >= 18.8) {
      this.pointTotal += 3.5;
      this.readinessGaugeValue += 3.5;
    } else if (this.preCOMP < 18.8 && this.preCOMP >= 15.9) {
      this.pointTotal += 3;
      this.readinessGaugeValue += 3;
    } else if (this.preCOMP < 15.9 && this.preCOMP >= 13.1) {
      this.pointTotal += 2.5;
      this.readinessGaugeValue += 2.5;
    } else if (this.preCOMP < 13.1 && this.preCOMP >= 10.2) {
      this.pointTotal += 2;
      this.readinessGaugeValue += 2;
    } else if (this.preCOMP < 10.2 && this.preCOMP >= 7.3) {
      this.pointTotal += 1.5;
      this.readinessGaugeValue += 1.5;
    } else if (this.preCOMP < 7.3 && this.preCOMP >= 4.5) {
      this.pointTotal += 1;
      this.readinessGaugeValue += 1;
    } else if (this.preCOMP < 4.5) {
      this.pointTotal += 0.5;
      this.readinessGaugeValue += 0.5;
    }
    //  *****************  HS Diploma Points****************
    if (this.diploma >= 53.3) {
      this.pointTotal += 5;
      this.readinessGaugeValue += 5;
    } else if (this.diploma < 53.3 && this.diploma >= 39.4) {
      this.pointTotal += 4;
      this.readinessGaugeValue += 4;
    } else if (this.diploma < 39.4 && this.diploma >= 25.5) {
      this.pointTotal += 3;
      this.readinessGaugeValue += 3;
    } else if (this.diploma < 25.5 && this.diploma >= 11.5) {
      this.pointTotal += 2;
      this.readinessGaugeValue += 2;
    } else if (this.diploma < 11.5) {
      this.pointTotal += 1;
      this.readinessGaugeValue += 1;
    }
    //  *****************  HS Chronic Absenteism Points****************
    if (this.chronAb < 5) {
      this.pointTotal += 5;
      this.engageGaugeValue += 5;
    } else if (this.chronAb < 7 && this.chronAb >= 5) {
      this.pointTotal += 4.5;
      this.engageGaugeValue += 4.5;
    } else if (this.chronAb < 9 && this.chronAb >= 7) {
      this.pointTotal += 4;
      this.engageGaugeValue += 4;
    } else if (this.chronAb < 11 && this.chronAb >= 9) {
      this.pointTotal += 3.5;
      this.engageGaugeValue += 3.5;
    } else if (this.chronAb < 13 && this.chronAb >= 11) {
      this.pointTotal += 3;
      this.engageGaugeValue += 3;
    } else if (this.chronAb < 15 && this.chronAb >= 13) {
      this.pointTotal += 2.5;
      this.engageGaugeValue += 2.5;
    } else if (this.chronAb < 17 && this.chronAb >= 15) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    } else if (this.chronAb < 19 && this.chronAb >= 17) {
      this.pointTotal += 1.5;
      this.engageGaugeValue += 1.5;
    } else if (this.chronAb < 21 && this.chronAb >= 19) {
      this.pointTotal += 1;
      this.engageGaugeValue += 1;
    } else if (this.chronAb < 23 && this.chronAb >= 21) {
      this.pointTotal += 0.5;
      this.engageGaugeValue += 0.5;
    } else if (this.chronAb >= 23) {
      this.pointTotal += 0;
      this.engageGaugeValue += 0;
    }
    //  *****************  HS 9th Grade Credit Sufficiency Points****************
    if (this.credSuff >= 99.7) {
      this.pointTotal += 5;
      this.engageGaugeValue += 5;
    } else if (this.credSuff < 99.7 && this.credSuff >= 92.4) {
      this.pointTotal += 4;
      this.engageGaugeValue += 4;
    } else if (this.credSuff < 92.4 && this.credSuff >= 85.1) {
      this.pointTotal += 3;
      this.engageGaugeValue += 3;
    } else if (this.credSuff < 85.1 && this.credSuff >= 77.8) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    } else if (this.credSuff < 77.8) {
      this.pointTotal += 1;
      this.engageGaugeValue += 1;
    }
  }

  //  *****************  Calculate Middle School Points****************

  msPoints() {
    //  *****************  MS Pooled Points****************
    if (this.pooled >= 56) {
      this.pointTotal += 25;
      this.AcadAchievGaugeValue += 25;
    } else if (this.pooled >= 55 && this.pooled < 56) {
      this.pointTotal += 24;
      this.AcadAchievGaugeValue += 24;
    } else if (this.pooled >= 54 && this.pooled < 55) {
      this.pointTotal += 23;
      this.AcadAchievGaugeValue += 23;
    } else if (this.pooled >= 52 && this.pooled < 54) {
      this.pointTotal += 22;
      this.AcadAchievGaugeValue += 22;
    } else if (this.pooled >= 50 && this.pooled < 52) {
      this.pointTotal += 21;
      this.AcadAchievGaugeValue += 21;
    } else if (this.pooled >= 48 && this.pooled < 50) {
      this.pointTotal += 20;
      this.AcadAchievGaugeValue += 20;
    } else if (this.pooled >= 46 && this.pooled < 48) {
      this.pointTotal += 19;
      this.AcadAchievGaugeValue += 19;
    } else if (this.pooled >= 44 && this.pooled < 46) {
      this.pointTotal += 18;
      this.AcadAchievGaugeValue += 18;
    } else if (this.pooled >= 42 && this.pooled < 44) {
      this.pointTotal += 17;
      this.AcadAchievGaugeValue += 17;
    } else if (this.pooled >= 41 && this.pooled < 42) {
      this.pointTotal += 16;
      this.AcadAchievGaugeValue += 16;
    } else if (this.pooled >= 40 && this.pooled < 41) {
      this.pointTotal += 15;
      this.AcadAchievGaugeValue += 15;
    } else if (this.pooled >= 39 && this.pooled < 40) {
      this.pointTotal += 14;
      this.AcadAchievGaugeValue += 14;
    } else if (this.pooled >= 37 && this.pooled < 39) {
      this.pointTotal += 13;
      this.AcadAchievGaugeValue += 13;
    } else if (this.pooled >= 36 && this.pooled < 37) {
      this.pointTotal += 12;
      this.AcadAchievGaugeValue += 12;
    } else if (this.pooled >= 34 && this.pooled < 36) {
      this.pointTotal += 11;
      this.AcadAchievGaugeValue += 11;
    } else if (this.pooled >= 32 && this.pooled < 34) {
      this.pointTotal += 10;
      this.AcadAchievGaugeValue += 10;
    } else if (this.pooled >= 30 && this.pooled < 32) {
      this.pointTotal += 9;
      this.AcadAchievGaugeValue += 9;
    } else if (this.pooled >= 28 && this.pooled < 30) {
      this.pointTotal += 8;
      this.AcadAchievGaugeValue += 8;
    } else if (this.pooled >= 27 && this.pooled < 28) {
      this.pointTotal += 7;
      this.AcadAchievGaugeValue += 7;
    } else if (this.pooled >= 26 && this.pooled < 27) {
      this.pointTotal += 6;
      this.AcadAchievGaugeValue += 6;
    } else if (this.pooled >= 25 && this.pooled < 26) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.pooled >= 24 && this.pooled < 25) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.pooled >= 23 && this.pooled < 24) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.pooled >= 22 && this.pooled < 23) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.pooled < 22) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    }
    //  *****************  MS Math MGP Points****************
    if (this.mMGP >= 65) {
      this.pointTotal += 10;
      this.growthGaugeValue += 10;
    } else if (this.mMGP < 65 && this.mMGP >= 61) {
      this.pointTotal += 9;
      this.growthGaugeValue += 9;
    } else if (this.mMGP < 61 && this.mMGP >= 58) {
      this.pointTotal += 8;
      this.growthGaugeValue += 8;
    } else if (this.mMGP < 58 && this.mMGP >= 54) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.mMGP < 54 && this.mMGP >= 51) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6;
    } else if (this.mMGP < 51 && this.mMGP >= 48) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.mMGP < 48 && this.mMGP >= 44) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.mMGP < 44 && this.mMGP >= 40) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.mMGP < 40 && this.mMGP >= 35) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.mMGP < 35) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    }
    //  *****************  MS ELA MGP Points****************
    if (this.eMGP >= 65) {
      this.pointTotal += 10;
      this.growthGaugeValue += 10;
    } else if (this.eMGP < 65 && this.eMGP >= 61) {
      this.pointTotal += 9;
      this.growthGaugeValue += 9;
    } else if (this.eMGP < 61 && this.eMGP >= 58) {
      this.pointTotal += 8;
      this.growthGaugeValue += 8;
    } else if (this.eMGP < 58 && this.eMGP >= 54) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.eMGP < 54 && this.eMGP >= 51) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6;
    } else if (this.eMGP < 51 && this.eMGP >= 48) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.eMGP < 48 && this.eMGP >= 44) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.eMGP < 44 && this.eMGP >= 40) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.eMGP < 40 && this.eMGP >= 35) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.eMGP < 35) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    }
    //  *****************  MS Math AGP Points****************
    if (this.mAGP >= 42) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.mAGP < 42 && this.mAGP >= 39) {
      this.pointTotal += 4.5;
      this.growthGaugeValue += 4.5;
    } else if (this.mAGP < 39 && this.mAGP >= 35) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.mAGP < 35 && this.mAGP >= 31) {
      this.pointTotal += 3.5;
      this.growthGaugeValue += 3.5;
    } else if (this.mAGP < 31 && this.mAGP >= 27) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.mAGP < 27 && this.mAGP >= 24) {
      this.pointTotal += 2.5;
      this.growthGaugeValue += 2.5;
    } else if (this.mAGP < 24 && this.mAGP >= 21) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.mAGP < 21 && this.mAGP >= 18) {
      this.pointTotal += 1.5;
      this.growthGaugeValue += 1.5;
    } else if (this.mAGP < 18 && this.mAGP >= 15) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    } else if (this.mAGP < 15) {
      this.pointTotal += 0.5;
      this.growthGaugeValue += 0.5;
    }
    //  *****************  MS ELA AGP Points****************
    if (this.eAGP >= 61) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.eAGP < 61 && this.eAGP >= 58) {
      this.pointTotal += 4.5;
      this.growthGaugeValue += 4.5;
    } else if (this.eAGP < 58 && this.eAGP >= 55) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.eAGP < 55 && this.eAGP >= 51) {
      this.pointTotal += 3.5;
      this.growthGaugeValue += 3.5;
    } else if (this.eAGP < 51 && this.eAGP >= 48) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.eAGP < 48 && this.eAGP >= 45) {
      this.pointTotal += 2.5;
      this.growthGaugeValue += 2.5;
    } else if (this.eAGP < 45 && this.eAGP >= 41) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.eAGP < 41 && this.eAGP >= 37) {
      this.pointTotal += 1.5;
      this.growthGaugeValue += 1.5;
    } else if (this.eAGP < 37 && this.eAGP >= 32) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    } else if (this.eAGP < 32) {
      this.pointTotal += 0.5;
      this.growthGaugeValue += 0.5;
    }
    //  *****************  MS WIDA Points****************
    if (this.wida >= 36) {
      this.pointTotal += 10;
      this.ElaProfGaugeValue += 10;
    } else if (this.wida < 36 && this.wida >= 32) {
      this.pointTotal += 9;
      this.ElaProfGaugeValue += 9;
    } else if (this.wida < 32 && this.wida >= 29) {
      this.pointTotal += 8;
      this.ElaProfGaugeValue += 8;
    } else if (this.wida < 29 && this.wida >= 26) {
      this.pointTotal += 7;
      this.ElaProfGaugeValue += 7;
    } else if (this.wida < 26 && this.wida >= 23) {
      this.pointTotal += 6;
      this.ElaProfGaugeValue += 6;
    } else if (this.wida < 23 && this.wida >= 20) {
      this.pointTotal += 5;
      this.ElaProfGaugeValue += 5;
    } else if (this.wida < 20 && this.wida >= 18) {
      this.pointTotal += 4;
      this.ElaProfGaugeValue += 4;
    } else if (this.wida < 18 && this.wida >= 16) {
      this.pointTotal += 3;
      this.ElaProfGaugeValue += 3;
    } else if (this.wida < 16 && this.wida >= 13) {
      this.pointTotal += 2;
      this.ElaProfGaugeValue += 2;
    } else if (this.wida < 13) {
      this.pointTotal += 1;
      this.ElaProfGaugeValue += 1;
    }
    //  *****************  MS mGAP Points****************
    if (this.mGAP >= 24) {
      this.pointTotal += 10;
      this.OppGapGaugeValue += 10;
    } else if (this.mGAP < 24 && this.mGAP >= 21) {
      this.pointTotal += 9;
      this.OppGapGaugeValue += 9;
    } else if (this.mGAP < 21 && this.mGAP >= 19) {
      this.pointTotal += 8;
      this.OppGapGaugeValue += 8;
    } else if (this.mGAP < 19 && this.mGAP >= 17) {
      this.pointTotal += 7;
      this.OppGapGaugeValue += 7;
    } else if (this.mGAP < 17 && this.mGAP >= 15) {
      this.pointTotal += 6;
      this.OppGapGaugeValue += 6;
    } else if (this.mGAP < 15 && this.mGAP >= 13) {
      this.pointTotal += 5;
      this.OppGapGaugeValue += 5;
    } else if (this.mGAP < 13 && this.mGAP >= 11) {
      this.pointTotal += 4;
      this.OppGapGaugeValue += 4;
    } else if (this.mGAP < 11 && this.mGAP >= 10) {
      this.pointTotal += 3;
      this.OppGapGaugeValue += 3;
    } else if (this.mGAP < 10 && this.mGAP >= 8) {
      this.pointTotal += 2;
      this.OppGapGaugeValue += 2;
    } else if (this.mGAP < 8) {
      this.pointTotal += 1;
      this.OppGapGaugeValue += 1;
    }
    //  *****************  MS eGAP Points****************
    if (this.eGAP >= 34) {
      this.pointTotal += 10;
      this.OppGapGaugeValue += 10;
    } else if (this.eGAP < 34 && this.eGAP >= 32) {
      this.pointTotal += 9;
      this.OppGapGaugeValue += 9;
    } else if (this.eGAP < 32 && this.eGAP >= 30) {
      this.pointTotal += 8;
      this.OppGapGaugeValue += 8;
    } else if (this.eGAP < 30 && this.eGAP >= 28) {
      this.pointTotal += 7;
      this.OppGapGaugeValue += 7;
    } else if (this.eGAP < 28 && this.eGAP >= 26) {
      this.pointTotal += 6;
      this.OppGapGaugeValue += 6;
    } else if (this.eGAP < 26 && this.eGAP >= 24) {
      this.pointTotal += 5;
      this.OppGapGaugeValue += 5;
    } else if (this.eGAP < 24 && this.eGAP >= 22) {
      this.pointTotal += 4;
      this.OppGapGaugeValue += 4;
    } else if (this.eGAP < 22 && this.eGAP >= 19) {
      this.pointTotal += 3;
      this.OppGapGaugeValue += 3;
    } else if (this.eGAP < 19 && this.eGAP >= 16) {
      this.pointTotal += 2;
      this.OppGapGaugeValue += 2;
    } else if (this.eGAP < 16) {
      this.pointTotal += 1;
      this.OppGapGaugeValue += 1;
    }
    //  *****************  MS Chronic Abesnteism Points****************
    if (this.chronAb < 5) {
      this.pointTotal += 10;
      this.engageGaugeValue += 10;
    } else if (this.chronAb >= 5 && this.chronAb < 6) {
      this.pointTotal += 9.5;
      this.engageGaugeValue += 9.5;
    } else if (this.chronAb >= 6 && this.chronAb < 7) {
      this.pointTotal += 9;
      this.engageGaugeValue += 9;
    } else if (this.chronAb >= 7 && this.chronAb < 8) {
      this.pointTotal += 8.5;
      this.engageGaugeValue += 8.5;
    } else if (this.chronAb >= 8 && this.chronAb < 9) {
      this.pointTotal += 8;
      this.engageGaugeValue += 8;
    } else if (this.chronAb >= 9 && this.chronAb < 10) {
      this.pointTotal += 7.5;
      this.engageGaugeValue += 7.5;
    } else if (this.chronAb >= 10 && this.chronAb < 11) {
      this.pointTotal += 7;
      this.engageGaugeValue += 7;
    } else if (this.chronAb >= 11 && this.chronAb < 12) {
      this.pointTotal += 6.5;
      this.engageGaugeValue += 6.5;
    } else if (this.chronAb >= 12 && this.chronAb < 13) {
      this.pointTotal += 6;
      this.engageGaugeValue += 6;
    } else if (this.chronAb >= 13 && this.chronAb < 14) {
      this.pointTotal += 5.5;
      this.engageGaugeValue += 5.5;
    } else if (this.chronAb >= 14 && this.chronAb < 15) {
      this.pointTotal += 5;
      this.engageGaugeValue += 5;
    } else if (this.chronAb >= 15 && this.chronAb < 16) {
      this.pointTotal += 4.5;
      this.engageGaugeValue += 4.5;
    } else if (this.chronAb >= 16 && this.chronAb < 17) {
      this.pointTotal += 4;
      this.engageGaugeValue += 4;
    } else if (this.chronAb >= 17 && this.chronAb < 18) {
      this.pointTotal += 3.5;
      this.engageGaugeValue += 3.5;
    } else if (this.chronAb >= 18 && this.chronAb < 19) {
      this.pointTotal += 3;
      this.engageGaugeValue += 3;
    } else if (this.chronAb >= 19 && this.chronAb < 20) {
      this.pointTotal += 2.5;
      this.engageGaugeValue += 2.5;
    } else if (this.chronAb >= 20 && this.chronAb < 21) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    } else if (this.chronAb >= 21 && this.chronAb < 22) {
      this.pointTotal += 1.5;
      this.engageGaugeValue += 1.5;
    } else if (this.chronAb >= 22 && this.chronAb < 23) {
      this.pointTotal += 1;
      this.engageGaugeValue += 1;
    } else if (this.chronAb >= 23 && this.chronAb < 24) {
      this.pointTotal += 0.5;
      this.engageGaugeValue += 0.5;
    } else if (this.chronAb >= 24) {
      this.pointTotal += 0;
      this.engageGaugeValue += 0;
    }
    //  *****************  MS NAC Cred Points****************
    if (this.nacCredReqs >= 90) {
      this.pointTotal += 3;
      this.engageGaugeValue += 3;
    } else if (this.nacCredReqs < 90 && this.nacCredReqs >= 75) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    } else if (this.nacCredReqs < 75 && this.nacCredReqs >= 60) {
      this.pointTotal += 1;
      this.engageGaugeValue += 1;
    } else if (this.nacCredReqs < 60) {
      this.pointTotal += 0;
      this.engageGaugeValue += 0;
    }
    //  *****************  MS Academic Learning Plan Points****************
    if (this.aLrnPlan >= 95) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    }
  }

  //  *****************  Calculate Elementary School Points****************

  esPoints() {
    //  *****************  ES Pooled Points****************
    if (this.pooled >= 60) {
      this.pointTotal += 20;
      this.AcadAchievGaugeValue += 20;
    } else if (this.pooled >= 58 && this.pooled < 60) {
      this.pointTotal += 19;
    } else if (this.pooled >= 56 && this.pooled < 58) {
      this.pointTotal += 18;
      this.AcadAchievGaugeValue += 18;
    } else if (this.pooled >= 55 && this.pooled < 56) {
      this.pointTotal += 17;
      this.AcadAchievGaugeValue += 17;
    } else if (this.pooled >= 54 && this.pooled < 55) {
      this.pointTotal += 16;
      this.AcadAchievGaugeValue += 16;
    } else if (this.pooled >= 53 && this.pooled < 54) {
      this.pointTotal += 15;
      this.AcadAchievGaugeValue += 15;
    } else if (this.pooled >= 52 && this.pooled < 53) {
      this.pointTotal += 14;
      this.AcadAchievGaugeValue += 14;
    } else if (this.pooled >= 50 && this.pooled < 52) {
      this.pointTotal += 13;
      this.AcadAchievGaugeValue += 13;
    } else if (this.pooled >= 49 && this.pooled < 50) {
      this.pointTotal += 12;
      this.AcadAchievGaugeValue += 12;
    } else if (this.pooled >= 48 && this.pooled < 49) {
      this.pointTotal += 11;
      this.AcadAchievGaugeValue += 11;
    } else if (this.pooled >= 46 && this.pooled < 48) {
      this.pointTotal += 10;
      this.AcadAchievGaugeValue += 10;
    } else if (this.pooled >= 44 && this.pooled < 46) {
      this.pointTotal += 9;
      this.AcadAchievGaugeValue += 9;
    } else if (this.pooled >= 42 && this.pooled < 44) {
      this.pointTotal += 8;
      this.AcadAchievGaugeValue += 8;
    } else if (this.pooled >= 40 && this.pooled < 42) {
      this.pointTotal += 7;
      this.AcadAchievGaugeValue += 7;
    } else if (this.pooled >= 38 && this.pooled < 40) {
      this.pointTotal += 6;
      this.AcadAchievGaugeValue += 6;
    } else if (this.pooled >= 35 && this.pooled < 38) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.pooled >= 33 && this.pooled < 35) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.pooled >= 30 && this.pooled < 33) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.pooled >= 26 && this.pooled < 30) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.pooled < 26) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    }
    //  *****************  ES ELA Points****************
    if (this.ELA >= 63) {
      this.pointTotal += 5;
      this.AcadAchievGaugeValue += 5;
    } else if (this.ELA < 63 && this.ELA >= 51) {
      this.pointTotal += 4;
      this.AcadAchievGaugeValue += 4;
    } else if (this.ELA < 51 && this.ELA >= 38) {
      this.pointTotal += 3;
      this.AcadAchievGaugeValue += 3;
    } else if (this.ELA < 38 && this.ELA >= 25) {
      this.pointTotal += 2;
      this.AcadAchievGaugeValue += 2;
    } else if (this.ELA < 25) {
      this.pointTotal += 1;
      this.AcadAchievGaugeValue += 1;
    }
    //  *****************  ES Math MGP Points****************
    if (this.mMGP >= 65) {
      this.pointTotal += 10;
      this.growthGaugeValue += 10;
    } else if (this.mMGP < 65 && this.mMGP >= 61) {
      this.pointTotal += 9;
      this.growthGaugeValue += 9;
    } else if (this.mMGP < 61 && this.mMGP >= 58) {
      this.pointTotal += 8;
      this.growthGaugeValue += 8;
    } else if (this.mMGP < 58 && this.mMGP >= 54) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.mMGP < 54 && this.mMGP >= 51) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6;
    } else if (this.mMGP < 51 && this.mMGP >= 48) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.mMGP < 48 && this.mMGP >= 44) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.mMGP < 44 && this.mMGP >= 40) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.mMGP < 40 && this.mMGP >= 35) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.mMGP < 35) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    }
    //  *****************  ES ELA MGP Points****************
    if (this.eMGP >= 65) {
      this.pointTotal += 10;
      this.growthGaugeValue += 10;
    } else if (this.eMGP < 65 && this.eMGP >= 61) {
      this.pointTotal += 9;
      this.growthGaugeValue += 9;
    } else if (this.eMGP < 61 && this.eMGP >= 58) {
      this.pointTotal += 8;
      this.growthGaugeValue += 8;
    } else if (this.eMGP < 58 && this.eMGP >= 54) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.eMGP < 54 && this.eMGP >= 51) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6;
    } else if (this.eMGP < 51 && this.eMGP >= 48) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.eMGP < 48 && this.eMGP >= 44) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.eMGP < 44 && this.eMGP >= 40) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.eMGP < 40 && this.eMGP >= 35) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.eMGP < 35) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    }
    //  *****************  ES  Math AGP Points****************
    if (this.mAGP >= 52) {
      this.pointTotal += 7.5;
      this.growthGaugeValue += 7.5;
    } else if (this.mAGP < 52 && this.mAGP >= 50) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.mAGP < 50 && this.mAGP >= 47) {
      this.pointTotal += 6.5;
      this.growthGaugeValue += 6.5;
    } else if (this.mAGP < 47 && this.mAGP >= 44) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6.5;
    } else if (this.mAGP < 44 && this.mAGP >= 41) {
      this.pointTotal += 5.5;
      this.growthGaugeValue += 5.5;
    } else if (this.mAGP < 41 && this.mAGP >= 39) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.mAGP < 39 && this.mAGP >= 37) {
      this.pointTotal += 4.5;
      this.growthGaugeValue += 4.5;
    } else if (this.mAGP < 37 && this.mAGP >= 35) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.mAGP < 35 && this.mAGP >= 33) {
      this.pointTotal += 3.5;
      this.growthGaugeValue += 3.5;
    } else if (this.mAGP < 33 && this.mAGP >= 31) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.mAGP < 31 && this.mAGP >= 29) {
      this.pointTotal += 2.5;
      this.growthGaugeValue += 2.5;
    } else if (this.mAGP < 29 && this.mAGP >= 27) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.mAGP < 27 && this.mAGP >= 25) {
      this.pointTotal += 1.5;
      this.growthGaugeValue += 1.5;
    } else if (this.mAGP < 25 && this.mAGP >= 23) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    } else if (this.mAGP < 23) {
      this.pointTotal += 0.5;
      this.growthGaugeValue += 0.5;
    }
    //  *****************  ES ELA AGP Points****************
    if (this.eAGP >= 63) {
      this.pointTotal += 7.5;
      this.growthGaugeValue += 7.5;
    } else if (this.eAGP < 63 && this.eAGP >= 61) {
      this.pointTotal += 7;
      this.growthGaugeValue += 7;
    } else if (this.eAGP < 61 && this.eAGP >= 59) {
      this.pointTotal += 6.5;
      this.growthGaugeValue += 6.5;
    } else if (this.eAGP < 59 && this.eAGP >= 57) {
      this.pointTotal += 6;
      this.growthGaugeValue += 6;
    } else if (this.eAGP < 57 && this.eAGP >= 55) {
      this.pointTotal += 5.5;
      this.growthGaugeValue += 5.5;
    } else if (this.eAGP < 55 && this.eAGP >= 53) {
      this.pointTotal += 5;
      this.growthGaugeValue += 5;
    } else if (this.eAGP < 53 && this.eAGP >= 51) {
      this.pointTotal += 4.5;
      this.growthGaugeValue += 4.5;
    } else if (this.eAGP < 51 && this.eAGP >= 49) {
      this.pointTotal += 4;
      this.growthGaugeValue += 4;
    } else if (this.eAGP < 49 && this.eAGP >= 47) {
      this.pointTotal += 3.5;
      this.growthGaugeValue += 3.5;
    } else if (this.eAGP < 47 && this.eAGP >= 45) {
      this.pointTotal += 3;
      this.growthGaugeValue += 3;
    } else if (this.eAGP < 45 && this.eAGP >= 43) {
      this.pointTotal += 2.5;
      this.growthGaugeValue += 2.5;
    } else if (this.eAGP < 43 && this.eAGP >= 41) {
      this.pointTotal += 2;
      this.growthGaugeValue += 2;
    } else if (this.eAGP < 41 && this.eAGP >= 38) {
      this.pointTotal += 1.5;
      this.growthGaugeValue += 1.5;
    } else if (this.eAGP < 38 && this.eAGP >= 35) {
      this.pointTotal += 1;
      this.growthGaugeValue += 1;
    } else if (this.eAGP < 35) {
      this.pointTotal += 0.5;
      this.growthGaugeValue += 0.5;
    }
    //  *****************  ES WIDA Points****************
    if (this.wida >= 57) {
      this.pointTotal += 10;
      this.ElaProfGaugeValue += 10;
    } else if (this.wida < 57 && this.wida >= 54) {
      this.pointTotal += 9;
      this.ElaProfGaugeValue += 9;
    } else if (this.wida < 54 && this.wida >= 51) {
      this.pointTotal += 8;
      this.ElaProfGaugeValue += 8;
    } else if (this.wida < 51 && this.wida >= 48) {
      this.pointTotal += 7;
      this.ElaProfGaugeValue += 7;
    } else if (this.wida < 48 && this.wida >= 45) {
      this.pointTotal += 6;
      this.ElaProfGaugeValue += 6;
    } else if (this.wida < 45 && this.wida >= 42) {
      this.pointTotal += 5;
      this.ElaProfGaugeValue += 5;
    } else if (this.wida < 42 && this.wida >= 39) {
      this.pointTotal += 4;
      this.ElaProfGaugeValue += 4;
    } else if (this.wida < 39 && this.wida >= 36) {
      this.pointTotal += 3;
      this.ElaProfGaugeValue += 3;
    } else if (this.wida < 36 && this.wida >= 33) {
      this.pointTotal += 2;
      this.ElaProfGaugeValue += 2;
    } else if (this.wida < 33) {
      this.pointTotal += 1;
      this.ElaProfGaugeValue += 1;
    }
    //  *****************  ES mGAP Points****************
    if (this.mGAP >= 42) {
      this.pointTotal += 10;
      this.OppGapGaugeValue += 10;
    } else if (this.mGAP < 42 && this.mGAP >= 39) {
      this.pointTotal += 9;
      this.OppGapGaugeValue += 9;
    } else if (this.mGAP < 39 && this.mGAP >= 36) {
      this.pointTotal += 8;
      this.OppGapGaugeValue += 8;
    } else if (this.mGAP < 36 && this.mGAP >= 33) {
      this.pointTotal += 7;
      this.OppGapGaugeValue += 7;
    } else if (this.mGAP < 33 && this.mGAP >= 30) {
      this.pointTotal += 6;
      this.OppGapGaugeValue += 6;
    } else if (this.mGAP < 30 && this.mGAP >= 27) {
      this.pointTotal += 5;
      this.OppGapGaugeValue += 5;
    } else if (this.mGAP < 27 && this.mGAP >= 24) {
      this.pointTotal += 4;
      this.OppGapGaugeValue += 4;
    } else if (this.mGAP < 24 && this.mGAP >= 20) {
      this.pointTotal += 3;
      this.OppGapGaugeValue += 3;
    } else if (this.mGAP < 20 && this.mGAP >= 16) {
      this.pointTotal += 2;
      this.OppGapGaugeValue += 2;
    } else if (this.mGAP < 16) {
      this.pointTotal += 1;
      this.OppGapGaugeValue += 1;
    }
    //  *****************  ES eGAP Points****************
    if (this.eGAP >= 52) {
      this.pointTotal += 10;
      this.OppGapGaugeValue += 10;
    } else if (this.eGAP < 52 && this.eGAP >= 49) {
      this.pointTotal += 9;
      this.OppGapGaugeValue += 9;
    } else if (this.eGAP < 49 && this.eGAP >= 46) {
      this.pointTotal += 8;
      this.OppGapGaugeValue += 8;
    } else if (this.eGAP < 46 && this.eGAP >= 43) {
      this.pointTotal += 7;
      this.OppGapGaugeValue += 7;
    } else if (this.eGAP < 43 && this.eGAP >= 40) {
      this.pointTotal += 6;
      this.OppGapGaugeValue += 6;
    } else if (this.eGAP < 40 && this.eGAP >= 37) {
      this.pointTotal += 5;
      this.OppGapGaugeValue += 5;
    } else if (this.eGAP < 37 && this.eGAP >= 34) {
      this.pointTotal += 4;
      this.OppGapGaugeValue += 4;
    } else if (this.eGAP < 34 && this.eGAP >= 31) {
      this.pointTotal += 3;
      this.OppGapGaugeValue += 3;
    } else if (this.eGAP < 31 && this.eGAP >= 27) {
      this.pointTotal += 2;
      this.OppGapGaugeValue += 2;
    } else if (this.eGAP < 27) {
      this.pointTotal += 1;
      this.OppGapGaugeValue += 1;
    }
    //  *****************  ES Chronic Abesnteism Points****************
    if (this.chronAb < 5) {
      this.pointTotal += 10;
      this.engageGaugeValue += 10;
    } else if (this.chronAb >= 5 && this.chronAb < 6) {
      this.pointTotal += 9.5;
      this.engageGaugeValue += 9.5;
    } else if (this.chronAb >= 6 && this.chronAb < 7) {
      this.pointTotal += 9;
      this.engageGaugeValue += 9;
    } else if (this.chronAb >= 7 && this.chronAb < 8) {
      this.pointTotal += 8.5;
      this.engageGaugeValue += 8.5;
    } else if (this.chronAb >= 8 && this.chronAb < 9) {
      this.pointTotal += 8;
      this.engageGaugeValue += 8;
    } else if (this.chronAb >= 9 && this.chronAb < 10) {
      this.pointTotal += 7.5;
      this.engageGaugeValue += 7.5;
    } else if (this.chronAb >= 10 && this.chronAb < 11) {
      this.pointTotal += 7;
      this.engageGaugeValue += 7;
    } else if (this.chronAb >= 11 && this.chronAb < 12) {
      this.pointTotal += 6.5;
      this.engageGaugeValue += 6.5;
    } else if (this.chronAb >= 12 && this.chronAb < 13) {
      this.pointTotal += 6;
      this.engageGaugeValue += 6;
    } else if (this.chronAb >= 13 && this.chronAb < 14) {
      this.pointTotal += 5.5;
      this.engageGaugeValue += 5.5;
    } else if (this.chronAb >= 14 && this.chronAb < 15) {
      this.pointTotal += 5;
      this.engageGaugeValue += 5;
    } else if (this.chronAb >= 15 && this.chronAb < 16) {
      this.pointTotal += 4.5;
      this.engageGaugeValue += 4.5;
    } else if (this.chronAb >= 16 && this.chronAb < 17) {
      this.pointTotal += 4;
      this.engageGaugeValue += 4;
    } else if (this.chronAb >= 17 && this.chronAb < 18) {
      this.pointTotal += 3.5;
      this.engageGaugeValue += 3.5;
    } else if (this.chronAb >= 18 && this.chronAb < 19) {
      this.pointTotal += 3;
      this.engageGaugeValue += 3;
    } else if (this.chronAb >= 19 && this.chronAb < 20) {
      this.pointTotal += 2.5;
      this.engageGaugeValue += 2.5;
    } else if (this.chronAb >= 20 && this.chronAb < 21) {
      this.pointTotal += 2;
      this.engageGaugeValue += 2;
    } else if (this.chronAb >= 21 && this.chronAb < 22) {
      this.pointTotal += 1.5;
      this.engageGaugeValue += 1.5;
    } else if (this.chronAb >= 22 && this.chronAb < 23) {
      this.pointTotal += 1;
      this.engageGaugeValue += 1;
    } else if (this.chronAb >= 23 && this.chronAb < 24) {
      this.pointTotal += 0.5;
      this.engageGaugeValue += 0.5;
    } else if (this.chronAb >= 24) {
      this.pointTotal += 0;
      this.engageGaugeValue += 0;
    }
  }

  // *************** Calculate Elementary School Stars *******************

  esStars() {
    if (this.pointTotal > 0 && this.pointTotal < 27) {
      this.starTotal = 1;
    } else if (this.pointTotal >= 27 && this.pointTotal < 50) {
      this.starTotal = 2;
    } else if (this.pointTotal >= 50 && this.pointTotal < 67) {
      this.starTotal = 3;
    } else if (this.pointTotal >= 67 && this.pointTotal < 84) {
      this.starTotal = 4;
    } else if (this.pointTotal >= 84 && this.pointTotal <= 100) {
      this.starTotal = 5;
    }
  }

  // *************** Calculate Middle School Stars *******************

  msStars() {
    if (this.pointTotal > 0 && this.pointTotal < 29) {
      this.starTotal = 1;
    } else if (this.pointTotal >= 29 && this.pointTotal < 50) {
      this.starTotal = 2;
    } else if (this.pointTotal >= 50 && this.pointTotal < 70) {
      this.starTotal = 3;
    } else if (this.pointTotal >= 70 && this.pointTotal < 80) {
      this.starTotal = 4;
    } else if (this.pointTotal >= 80 && this.pointTotal <= 100) {
      this.starTotal = 5;
    }
  }

  // *************** Calculate High School Stars *******************

  hsStars() {
    if (this.pointTotal > 0 && this.pointTotal < 27) {
      this.starTotal = 1;
    } else if (this.pointTotal >= 27 && this.pointTotal < 50) {
      this.starTotal = 2;
    } else if (this.pointTotal >= 50 && this.pointTotal < 70) {
      this.starTotal = 3;
    } else if (this.pointTotal >= 70 && this.pointTotal < 82) {
      this.starTotal = 4;
    } else if (this.pointTotal >= 82 && this.pointTotal <= 100) {
      this.starTotal = 5;
    }
  }

  // *************** Calculate Points Based on School Level*******************

  getPoints() {
    if (this.schoolLevelSelect === "ES") {
      this.esPoints();
    }
    if (this.schoolLevelSelect === "MS") {
      this.msPoints();
    }
    if (this.schoolLevelSelect === "HS") {
      this.hsPoints();
    }
  }

  // *************** Calculate Stars based on School Level *******************

  getStars() {
    if (this.schoolLevelSelect === "ES") {
      this.esStars();
    }
    if (this.schoolLevelSelect === "MS") {
      this.msStars();
    }
    if (this.schoolLevelSelect === "HS") {
      this.hsStars();
    }
  }

  makeEsGauges() {
    new Chart($("#gaugeAcadAchiev"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.AcadAchievGaugeValue,
              this.esAcadAchievMax - this.AcadAchievGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpAcadAchiev")[0].childNodes.length; i++) {
      if ($(".gaugeGrpAcadAchiev")[0].childNodes[i].className === "value") {
        $(".gaugeGrpAcadAchiev")[0].childNodes[
          i
        ].innerHTML = this.AcadAchievGaugeValue;
      }
    }
    $(".gaugeGrpAcadAchiev")[0].style.display = "block";

    new Chart($("#gaugeGrowth"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.growthGaugeValue,
              this.esGrowthMax - this.growthGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpGrowth")[0].childNodes.length; i++) {
      if ($(".gaugeGrpGrowth")[0].childNodes[i].className === "value") {
        $(".gaugeGrpGrowth")[0].childNodes[i].innerHTML = this.growthGaugeValue;
      }
    }
    $(".gaugeGrpGrowth")[0].style.display = "block";

    new Chart($("#gaugeElaProf"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.ElaProfGaugeValue,
              this.esElaProfMax - this.ElaProfGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpElaProf")[0].childNodes.length; i++) {
      if ($(".gaugeGrpElaProf")[0].childNodes[i].className === "value") {
        $(".gaugeGrpElaProf")[0].childNodes[
          i
        ].innerHTML = this.ElaProfGaugeValue;
      }
    }
    $(".gaugeGrpElaProf")[0].style.display = "block";

    new Chart($("#gaugeOppGap"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.OppGapGaugeValue,
              this.esOppGapMax - this.OppGapGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpOppGap")[0].childNodes.length; i++) {
      if ($(".gaugeGrpOppGap")[0].childNodes[i].className === "value") {
        $(".gaugeGrpOppGap")[0].childNodes[i].innerHTML = this.OppGapGaugeValue;
      }
    }
    $(".gaugeGrpOppGap")[0].style.display = "block";

    new Chart($("#gaugeEngage"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.engageGaugeValue,
              this.esEngageMax - this.engageGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpEngage")[0].childNodes.length; i++) {
      if ($(".gaugeGrpEngage")[0].childNodes[i].className === "value") {
        $(".gaugeGrpEngage")[0].childNodes[i].innerHTML = this.engageGaugeValue;
      }
    }
    $(".gaugeGrpEngage")[0].style.display = "block";
  }

  makeMsGauges() {
    new Chart($("#gaugeAcadAchiev"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.AcadAchievGaugeValue,
              this.msAcadAchievMax - this.AcadAchievGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpAcadAchiev")[0].childNodes.length; i++) {
      if ($(".gaugeGrpAcadAchiev")[0].childNodes[i].className === "value") {
        $(".gaugeGrpAcadAchiev")[0].childNodes[
          i
        ].innerHTML = this.AcadAchievGaugeValue;
      }
    }
    $(".gaugeGrpAcadAchiev")[0].style.display = "block";

    new Chart($("#gaugeGrowth"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.growthGaugeValue,
              this.msGrowthMax - this.growthGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpGrowth")[0].childNodes.length; i++) {
      if ($(".gaugeGrpGrowth")[0].childNodes[i].className === "value") {
        $(".gaugeGrpGrowth")[0].childNodes[i].innerHTML = this.growthGaugeValue;
      }
    }
    $(".gaugeGrpGrowth")[0].style.display = "block";

    new Chart($("#gaugeElaProf"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.ElaProfGaugeValue,
              this.msElaProfMax - this.ElaProfGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpElaProf")[0].childNodes.length; i++) {
      if ($(".gaugeGrpElaProf")[0].childNodes[i].className === "value") {
        $(".gaugeGrpElaProf")[0].childNodes[
          i
        ].innerHTML = this.ElaProfGaugeValue;
      }
    }
    $(".gaugeGrpElaProf")[0].style.display = "block";

    new Chart($("#gaugeOppGap"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.OppGapGaugeValue,
              this.msOppGapMax - this.OppGapGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpOppGap")[0].childNodes.length; i++) {
      if ($(".gaugeGrpOppGap")[0].childNodes[i].className === "value") {
        $(".gaugeGrpOppGap")[0].childNodes[i].innerHTML = this.OppGapGaugeValue;
      }
    }
    $(".gaugeGrpOppGap")[0].style.display = "block";

    new Chart($("#gaugeEngage"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.engageGaugeValue,
              this.msEngageMax - this.engageGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpEngage")[0].childNodes.length; i++) {
      if ($(".gaugeGrpEngage")[0].childNodes[i].className === "value") {
        $(".gaugeGrpEngage")[0].childNodes[i].innerHTML = this.engageGaugeValue;
      }
    }
    $(".gaugeGrpEngage")[0].style.display = "block";
  }

  makeHsGauges() {
    new Chart($("#gaugeAcadAchiev"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.AcadAchievGaugeValue,
              this.hsAcadAchievMax - this.AcadAchievGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpAcadAchiev")[0].childNodes.length; i++) {
      if ($(".gaugeGrpAcadAchiev")[0].childNodes[i].className === "value") {
        $(".gaugeGrpAcadAchiev")[0].childNodes[
          i
        ].innerHTML = this.AcadAchievGaugeValue;
      }
    }
    $(".gaugeGrpAcadAchiev")[0].style.display = "block";

    new Chart($("#gaugeGradRate"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.gradRateGaugeValue,
              this.hsGradRateMax - this.gradRateGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpGradRate")[0].childNodes.length; i++) {
      if ($(".gaugeGrpGradRate")[0].childNodes[i].className === "value") {
        $(".gaugeGrpGradRate")[0].childNodes[
          i
        ].innerHTML = this.gradRateGaugeValue;
      }
    }
    $(".gaugeGrpGradRate")[0].style.display = "block";

    new Chart($("#gaugeElaProf"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.ElaProfGaugeValue,
              this.hsElaProfMax - this.ElaProfGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpElaProf")[0].childNodes.length; i++) {
      if ($(".gaugeGrpElaProf")[0].childNodes[i].className === "value") {
        $(".gaugeGrpElaProf")[0].childNodes[
          i
        ].innerHTML = this.ElaProfGaugeValue;
      }
    }
    $(".gaugeGrpElaProf")[0].style.display = "block";

    new Chart($("#gaugeReadiness"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.readinessGaugeValue,
              this.hsReadinessMax - this.readinessGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpReadiness")[0].childNodes.length; i++) {
      if ($(".gaugeGrpReadiness")[0].childNodes[i].className === "value") {
        $(".gaugeGrpReadiness")[0].childNodes[
          i
        ].innerHTML = this.readinessGaugeValue;
      }
    }
    $(".gaugeGrpReadiness")[0].style.display = "block";

    new Chart($("#gaugeEngage"), {
      type: "doughnut",
      data: {
        datasets: [
          {
            backgroundColor: ["#17A2B8", "lightgray"],
            borderColor: "white",
            borderWidth: 5,
            data: [
              this.engageGaugeValue,
              this.hsEngageMax - this.engageGaugeValue
            ],
            weight: 1
          }
        ]
      },
      options: {
        circumference: 1.5 * Math.PI,
        rotation: 0.75 * Math.PI,
        cutoutPercentage: 70,
        tooltips: { enabled: false },
        hover: { mode: null }
      }
    });
    for (let i = 0; i < $(".gaugeGrpEngage")[0].childNodes.length; i++) {
      if ($(".gaugeGrpEngage")[0].childNodes[i].className === "value") {
        $(".gaugeGrpEngage")[0].childNodes[i].innerHTML = this.engageGaugeValue;
      }
    }
    $(".gaugeGrpEngage")[0].style.display = "block";
  }

  makeGauges() {
    if (this.schoolLevelSelect === "ES") {
      this.makeEsGauges();
    }
    if (this.schoolLevelSelect === "MS") {
      this.makeMsGauges();
    }
    if (this.schoolLevelSelect === "HS") {
      this.makeHsGauges();
    }
  }

  makeLineChart() {
    if (
      this.schoolLevelSelect === "ES" ||
      this.schoolLevelSelect === "MS" ||
      this.schoolLevelSelect === "HS"
    ) {
      $("#chartRow").css("display", "block");
      new Chart($("#lineChart"), {
        type: "line",
        data: {
          labels: [
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2018",
            "2019",
            "2020"
          ],
          datasets: [
            {
              label: "Star Scores", // Name the series
              data: [3, 2, 4, 5, 2, 4, 3, 2, 1, this.starTotal], // Specify the data values array
              fill: false,
              borderColor: "#004A9C", // Add custom color border (Line)
              backgroundColor: "#004A9C", // Add custom color background (Points and Fill)
              borderWidth: 1 // Specify bar border width
            }
          ]
        },
        options: {
          responsive: true, // Instruct chart js to respond nicely.
          maintainAspectRatio: false // Add to prevent default behaviour of full-width/height
        }
      });
    }
  }
}
