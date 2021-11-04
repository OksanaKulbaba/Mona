import { Component, OnInit } from '@angular/core';

interface RecordData {
  time: Date;
  record: string;
}

interface RecordShown {
  [key: string]: string;
}
interface Rec{
  [key: string]: string[];
}

interface Intervals {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedValue: number = 5;
  rangeColumns: Array<string> = [];// this.generateColumn()
  rangeColumnsForColculate: Array<number> = [];
  dataBase = AppComponent.generateRandomDate();
  dataSource: RecordShown[] = []

  intervals: Intervals[] = [
    {value: 5, viewValue: '5 Min'},
    {value: 30, viewValue: '30 Min'},
    {value: 60, viewValue: '1 hour'}
  ];

  constructor() {
    console.log('this.base',this.dataBase)
  }

  ngOnInit() {
    this.generateColumn('60')
    console.log('this.data',this.dataSource)
  }

  private static generateRandomDate(): Array<RecordData> {
    const records: Array<RecordData> = []
    const start: Date = new Date(2021, 10, 1)
    const end: Date = new Date(2021, 11, 1);
    for (let i = 0; i < 1000; i++) {
      const time = AppComponent.randomDate(start, end);
      records.push({
        time: time,
        record: 'Detail: ' + time.toLocaleTimeString().slice(0,5),
      })
    }
    return records;
  }
  private static randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }


  public generateColumn($event?: any) {
    this.selectedValue = $event;
    let columnsD: Array<string> = ['date'];
    const range = (24 * 60) / $event
    for (let i = 1; i <= range; i++) {
      const columnName = i * $event;
      columnsD.push(AppComponent.transformDate(columnName))
      this.rangeColumnsForColculate.push(i * $event)
    }
    this.rangeColumns = columnsD;
    this.dataSource = [];
    this.getData();
  }

  private getData(): void {
    const allDate = this.dataBase.map(d => {
      return d.time.getDate()
    }).filter((v, i, a) => a.indexOf(v) === i).sort( (a,b)=> a-b);
    allDate.forEach(date => {
      const recordsForDay =  this.getRecordsForDate(date);
      this.dataSource.push(recordsForDay)
      }
    )
  }

  getRecordsForDate(date: number) {
    let result: RecordShown= {};
    const allRecordsByDay = this.dataBase.filter(record => record.time.getDate() === date);
    this.rangeColumnsForColculate.forEach(range =>{
       result  = {
         ... result,
         [AppComponent.transformDate(range)]: this.getRecordByRange(range, allRecordsByDay)
       }
      }
    )
    result['date'] = date.toString();
    return result;
  }

  getRecordByRange(range: number, recordDate: RecordData[]): string {

    return recordDate.filter(record => {
      const minute = record.time.getHours() * 60 + record.time.getMinutes();
      if (minute <= range && minute > (range - this.selectedValue)) {
        return record;
      }
      return;
    }).map(rec => rec.record).toString() ;
  }
  private static transformDate(columnName: number): string{
    const h = Math.trunc(columnName / 60)
    const m = columnName % 60
    return `${ h > 9 ? h : '0' + h }:${ m > 9 ? m : '0' + m }`;
  }

}
