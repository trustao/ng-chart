import {Chart} from '@antv/g2';
import EventEmitter from 'events';
import {Column, DataSource} from '../interface';

export class Base extends EventEmitter {
  chart: Chart;
  aggregateColumn: Column[] = [];
  dimensionColumn: Column[] = [];
  columnsMap: {[k: string]: Column} = {};
  dimensionValues: {[k: string]: any[]} = {}
  colors10 = color10;
  colors20 = color20;

  constructor(
    public container: HTMLElement,
    public dataSource: DataSource,
    private config: { [k: string]: any } = {}
  ) {
    super();
    this.init();
  }

  init() {
    this.chart = new Chart({
      container: this.container,
      autoFit: true,
      appendPadding: 10,
      ...this.config
    });
    this.initColumn();
  }

  initColumn() {
    const a = [];
    const d = [];
    const map = {}
    this.dataSource.columns.forEach(i => {
      if (i.type === 'Aggregate') {
        a.push(i);
      } else {
        d.push(i);
      }
      map[i.name] = i;
    })
    this.columnsMap = map;
    this.dimensionColumn = d;
    this.aggregateColumn = a;
    this.updateColumnValues();
  }

  updateColumnValues() {
    const obj: {[k: string]: any[]} = {}
    this.dataSource.data.forEach(v => {
      this.dimensionColumn.forEach(k => {
        obj[k.name] = obj[k.name] || [];
        if (!obj[k.name].includes(v[k.name])) {
          obj[k.name].push(v[k.name]);
        }
      });
    })
    this.dimensionValues = obj;
  }

  drawBackground() {

  }

  draw(isUpdate?: boolean) {
    this.drawBackground();
    this.chart.render(isUpdate);
  }
}

const color10 = [
  '#5B8FF9',
  '#5AD8A6',
  '#5D7092',
  '#F6BD16',
  '#E86452',
  '#6DC8EC',
  '#945FB9',
  '#FF9845',
  '#1E9493',
  '#FF99C3'
]

const color20 = [
  '#5B8FF9',
  '#CDDDFD',
  '#5AD8A6',
  '#CDF3E4',
  '#5D7092',
  '#CED4DE',
  '#F6BD16',
  '#FCEBB9',
  '#E86452',
  '#F8D0CB',
  '#6DC8EC',
  '#D3EEF9',
  '#945FB9',
  '#DECFEA',
  '#FF9845',
  '#FFE0C7',
  '#1E9493',
  '#BBDEDE',
  '#FF99C3',
  '#FFE0ED'
]
