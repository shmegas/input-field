import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Data from '../../app/data.json';
import Data2 from '../../app/datasc2.json';
import { ExcelService } from '../../service/excel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userquestion',
  templateUrl: './userquestion.component.html',
  styleUrls: ['./userquestion.component.css'],
})
export class UserquestionComponent implements OnInit {
  editInput: any;
  selectedScenario!: any;
  data: any = {};
  // data1 = '';s
  // data2 = '';
  inputs = ['text', 'button', 'edit', 'subtext', 'placeholder'];
  firstFormGroup: FormGroup;
  isEditable = true;
  isReadonly:any = {};
  // usersData: IUser[] = Data;
  userData: IUser2[] = Data;
  // userDataScTwo: IDataSc2[] = Data2;
  userDataScTwo: IData2[] = Data2;
  resArray: any[] = [];
  inputsdata = this.getOrSetInputSequance();
  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) {
    this.firstFormGroup = this.fb.group({
      // firstCtrl: ['', Validators.required],
      firstCtrl0: ['', Validators.required],
      firstCtrl1: ['', Validators.required],
      firstCtrl2: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.selectedScenario = this.activatedRoute.snapshot.params;
    // alert(JSON.stringify(this.selectedScenario['selectedScenario']));
   
    
    // if (this.selectedScenario['selectedScenario'] == '1') {
    //   this.bindData(this.userData[0].questions[0].id);
    // } else {
    //   this.bindData(this.userDataScTwo[0].questions[0].id);
    // }
    // console.dir(this.inputsdata)
    // console.log(this.userData.length);
    // console.log(this.userData.length-1)
  }
  ngAfterViewInit() {
   var data= this.getData();
   
    if (this.selectedScenario['selectedScenario'] == '1') {
      data.forEach(element => {
        
        this.bindData(element["id"]);
      });
      
    } else {
      data.forEach(element => {
        
        this.bindData(element["id"]);
      });
    }
    
  }
 
  onItemChange($event: any,id:string) {
    debugger
    this.data[id] = $event.target.value;
    // console.log(this.data);
  }

  edit(id:string) {
    this.isReadonly[id] = false;
  }

  balancedLatinSquare(array: any[], participantId: number) {
    var result = [];

    // Based on "Bradley, J. V. Complete counterbalancing of immediate sequential effects in a Latin square design. J. Amer. Statist. Ass.,.1958, 53, 525-528. "

    if (this.selectedScenario['selectedScenario'] == '1') {
      for (var i = 0, j = 0, h = 0; i < this.userData.length; ++i) {
        var val = 0;
        if (i < 2 || i % 2 != 0) {
          val = j++;
        } else {
          val = array.length - h - 1;
          ++h;
        }
        var idx = (val + participantId) % array.length;
        result.push(array[idx]);
      }
    } else {
      for (var i = 0, j = 0, h = 0; i < this.userDataScTwo.length; ++i) {
        var val = 0;
        if (i < 2 || i % 2 != 0) {
          val = j++;
        } else {
          val = array.length - h - 1;
          ++h;
        }

        var idx = (val + participantId) % array.length;
        result.push(array[idx]);
      }
    }

    if (array.length % 2 != 0 && participantId % 2 != 0) {
      result = result.reverse();
    }

    return result;
  }
  // ==== first=====

  next(item: any, index: number) {
    // if (this.inputsdata[index] == 'edit') {
    //   this.data = this.editInput
    // }
    
    // alert(JSON.stringify(this.data));

    // for (let i = 0; i < 3; i++) {
    //   this.nextSubmit(item[i], i, this.data[item['id']]);
    // }
    
    item.questions.forEach((element:any,ind:number) => {
      
      this.nextSubmit(element,index,this.data[element["id"]])
    });
  }

  nextSubmit(item: any, index: number, data: any) {
    debugger
    item['userAnswer'] = data;

    // item.questions[0]['userAnswer'] = data;
    // item.questions[1]['userAnswer'] = this.data1;
    // item.questions[2]['userAnswer'] = this.data2;

    var databaseData = this.getData();
    var recFound = databaseData.find((x) => x['id'] == item['id']);
    if (recFound != undefined) {

      databaseData.forEach(element => {
        if(element["id"]==item["id"])
        {
          element['userAnswer'] = data;
        }
      });
      
      // ==========
      // databaseData[index].questions[0]['userAnswer'] = this.data;
      // databaseData[index].questions[1]['userAnswer'] = this.data1;
      // databaseData[index].questions[2]['userAnswer'] = this.data2;
    } else {
      databaseData.push(item);
    }
    if (this.selectedScenario['selectedScenario'] == '1') {
      localStorage.setItem('databaseForScOne', JSON.stringify(databaseData)!);
    } else {
      localStorage.setItem('databaseForScTwo', JSON.stringify(databaseData)!);
    }
    this.saveGenerateParticipantId();
    if (this.selectedScenario['selectedScenario'] == '1') {
      if (index != this.userData.length - 1) {
        // debugger
        // this.bindData(this.userData[index+1].questions[0].id);
        // this.bindData(this.userData[index+1].questions[1].id);
        // this.bindData(this.userData[index+1].questions[2].id);

        this.userData[index+1].questions.forEach(element => {
          this.bindData(element.id);
        });
      }
    } else {
      if (index != this.userDataScTwo.length - 1) {
        this.userDataScTwo[index+1].questions.forEach(element => {
          this.bindData(element.id);
        });
        // this.bindData(this.userDataScTwo[index].questions[0].id);
        // this.bindData(this.userDataScTwo[index].questions[1].id);
        // this.bindData(this.userDataScTwo[index].questions[2].id);
      }
    }
    // this.isReadonly = true;
  }

  submit(item: any, index: number) {
    this.next(item, index);
  }

  bindData(id: any) {
    
    var databaseData = this.getData();
    if (databaseData.length != 0) {
      var databaseRec = databaseData.find((el) => el['id'] == id);
      if (databaseRec == undefined||databaseRec == '') {
      

        this.data[id]=''
      } else {
         this.data[id] = databaseRec['userAnswer'];
      }
      console.dir(databaseRec);
      // this.data = databaseRec["userAnswer"]
    }
  }

  getData(): any[] {
    var res = '';
    if (this.selectedScenario['selectedScenario'] == '1') {
      res = localStorage.getItem('databaseForScOne')!;
    } else {
      res = localStorage.getItem('databaseForScTwo')!;
    }

    if (res != undefined) {
      return JSON.parse(res);
    } else {
      return [];
    }
  }

  saveGenerateParticipantId() {
    var partId = this.getParticipantId();
    if (partId == '') {
      var rendomParticipantId = Math.floor(Math.random() * (99999 - 1)) + 1;
      localStorage.setItem('participantId', rendomParticipantId.toString());
    }
  }
  getParticipantId() {
    var partId = localStorage.getItem('participantId');

    if (partId == undefined) {
      return '';
    } else {
      return parseInt(partId);
    }
  }

  getOrSetInputSequance() {
    this.selectedScenario = this.activatedRoute.snapshot.params;
    var seq = localStorage.getItem('inputSeq');
    if (seq == undefined) {
      var partId = this.getParticipantId();
      if (partId == '') {
        this.saveGenerateParticipantId();
        partId = this.getParticipantId();
      }

      var inputSeq = this.balancedLatinSquare(
        this.inputs,
        parseInt(partId.toString())
      );
      localStorage.setItem('inputSeq', JSON.stringify(inputSeq));
      return inputSeq;
    } else {
      return JSON.parse(seq);
    }
  }
  submitableDataForScOne(item: any, index: number) {
    this.next(item, index);
    var data = '';
    if (this.selectedScenario['selectedScenario'] == '1') {
      data = localStorage.getItem('databaseForScOne')!;
    } else {
      data = localStorage.getItem('databaseForScTwo')!;
    }

    var partId = localStorage.getItem('participantId');
    var seq = localStorage.getItem('inputSeq');
    var decodedData = JSON.parse(data!);

    decodedData.forEach((element: any, index: number) => {
      element['partId'] = partId;
      element['input'] = JSON.parse(seq!)[index]?.toString();
    });

    this.exportAsXLSX(decodedData);
    // var obj=
  }

  isSubtextVisible:any = {};
  onFocusEvent(event: any,id:string) {
    this.isSubtextVisible[id] = true;
  }

  exportAsXLSX(data: any): void {
    this.excelService.exportAsExcelFile(data, 'sample');
  }
}

interface IUser {
  id: string;
  question: string;
  answers: string;
}

interface IUser2 {
  questions: IUser[];
}

interface IDataSc2 {
  id: string;
  question: string;
  answers: string;
  img: string;
}

interface IData2 {
  questions: IDataSc2[];
}
