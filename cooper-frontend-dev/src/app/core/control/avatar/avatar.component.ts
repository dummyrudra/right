import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'j-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent implements OnInit {
 @Input() user:any;
  @Input()
  avatarUrl: any;
  @Input()default: any;
  @Input() size = 12;
  @Input() name = '';
  @Input() rounded = true;
  @Input() className = '';
@Output() filterEvent:EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
   // console.log('av',this.avatarUrl==undefined,this.default) 
   //console.log('user',this.user)
  }

  get style() {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      'background-image': `url('${this.avatarUrl}')`,
      'border-radius': this.rounded ? '100%' : '3px'
    };
  }
  get style1() {
    return {
      width: `${this.size}px`,
      height: `${this.size}px`,
      'background-color':this.stringToHslColor(this.default),
      'border-radius': this.rounded ? '100%' : '3px'
    };
  }

  stringToHslColor(str: any) {
    var hash = 0;
    for (var i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 30 + '%, ' + 40 + '%)';
  }

  taskFilter(id:any){
     this.filterEvent.emit(id)
  }

}
