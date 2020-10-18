import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Line} from './chart/component/Line';
import {dataSource} from './chart/mockdata';
import {createNameImage} from './chart/until';
import './chart/register/interaction';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements AfterViewInit {
  title = 'ng-chart';
  @ViewChild('c', {static: false}) elementRef: ElementRef;

  ngAfterViewInit() {
    console.log(dataSource);
    createNameImage(
      'ABC',
      this.elementRef.nativeElement.offsetWidth,
      this.elementRef.nativeElement.offsetHeight
    ).then(url => {
      console.log(url);
      const chart = new Line(this.elementRef.nativeElement, dataSource, { backgroundImage: url});
      chart.draw();
    });
  }

}
