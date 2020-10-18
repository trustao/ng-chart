import {Base} from './base';
import {Column, DataSource} from '../interface';
import {AxisOption, LegendOption, ScaleOption} from '@antv/g2/lib/interface';
import moment from 'moment';
import DataSet from '@antv/data-set';
import {cartesian} from '../until';


export class RectBase extends Base {
  scaleOpt: { [k: string]: ScaleOption } = {};
  axisOpts: {[k: string]: AxisOption} = {};
  legendOpt: LegendOption;

  constructor(
    public container: HTMLElement,
    public dataSource: DataSource,
    config: { [k: string]: any } = {}
  ) {
    super(container, dataSource, config);
    this.initScale();
    this.initAxis();
    this.initLegend();
  }

  initScale() {
    this.dataSource.columns.forEach(i => {
      if (i.dataType === 'Linear') {
        this.scaleOpt[i.name] = {
          nice: true,
        };
      } else {
        this.scaleOpt[i.name] = {
          type: 'cat',
          showLast: true
        };
      }
    });
  }

  initAxis() {
    this.aggregateColumn.slice(0, 2).forEach(i => {
      if (i.dataType === 'Date') {
        this.axisOpts[i.name] = {
          label: {
            formatter(val) {
              if (moment(+val).startOf('day').valueOf() === +val) {
                return moment(+val).format('YYYY-MM-DD HH:mm');
              } else {
                return moment(+val).format('HH:mm');
              }
            }
          },
        };
      } else {
        this.axisOpts[i.name] = {};
      }
      if (i.labelFormat) {
        const label = {
          // @ts-ignore
          ...(this.axisOpts[i.name].label || {}),
          formatter(v) {
            return i.labelFormat(v);
          }
        }
        // @ts-ignore
        this.axisOpts[i.name].label = label;
      }
    });
  }

  initLegend() {
    this.legendOpt = {
      custom: true,
      items: cartesian(this.dimensionColumn.map(i => this.dimensionValues[i.name])).map(i => ({
        id: i.join('-'),
        name: i.map((dimV, idx) => this.dimensionColumn[idx].labelFormat ?  this.dimensionColumn[idx].labelFormat(dimV) : dimV).join(' '),
        value: i,
        marker: {
          symbol: 'line',
        }
      }))
    };
    this.chart.on('legend-item:click', (ev) => {
      const target = ev.target;
      const delegateObject = target.get('delegateObject');
      const item = delegateObject.item; // 图例选项
      console.log(ev, item)
    });
  }

  scale() {
    this.chart.scale(this.scaleOpt);
  }

  axis() {
    Object.keys(this.axisOpts).forEach(i => {
      this.chart.axis(i, this.axisOpts[i]);
    });
  }

  legend() {
    this.chart.legend(this.legendOpt);
    this.chart.removeInteraction('legend-filter');
  }

  draw() {
    this.scale();
    this.axis();
    console.log(this.chart)
    this.legend();
    super.draw();
  }
}


