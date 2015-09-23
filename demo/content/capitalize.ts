import {Component, View, Pipe} from 'angular2/angular2';

@Pipe({
  name: 'capitalize'
})
export class Capitalize {
  //Note: {{s | capitalize:'foo':1}} would give ['foo', 1] as args
  transform(value: string, args: any[]) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}