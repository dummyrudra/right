import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namePipe'
})
export class NamePipePipe implements PipeTransform {

  transform(value: string,fullName:string):string {
   //console.log(fullName)
    if(value){
      let fn=fullName[0];
      let ln='';
      let ln1=fullName?.split(' ');
      if(ln1.length>1){
         ln=ln1[1][0]
      }
     // console.log(fn+ln)
      return fn+ln;
    }
  
    return '';
  }

}
