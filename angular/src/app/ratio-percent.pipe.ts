import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ratioPercent'
})
export class RatioPercentPipe implements PipeTransform {

  transform(value: number, args?: any): any {
    let percent = value * 100
    return percent.toFixed(2) + "%";
  }

}
