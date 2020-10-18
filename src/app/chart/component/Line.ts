import {DataSource} from '../interface';
import {RectBase} from './RectBase';
import Geometry from '@antv/g2/lib/geometry/base';
import {TooltipOption} from '@antv/g2/lib/interface';
import * as moment from 'moment';


export class Line extends RectBase {

  channels = ['shape', 'color', 'size'];
  channelFields: {[channel: string]: string[]} = {};
  channelOpt: {[channel: string]: any} = {
    color: {
      values: this.colors10
    },
    shape: {
      values: ['dot', 'line']
    }
  };
  toolTipOpt: TooltipOption = {
    showCrosshairs: true,
    shared: true,
    customContent: (title, data) => {
      const [x, y] = Object.keys(this.axisOpts);
      const xColumn = this.columnsMap[x];
      if (xColumn) {
        title = xColumn.labelFormat ?  xColumn.labelFormat(title) :
          xColumn.dataType === 'Date' ? moment(+title).format('YYYY-MM-DD HH:mm') : title;
      }
      const dataStr = data.map(item => {
        const name = this.dimensionColumn.map(k => k.labelFormat ? k.labelFormat(item.data[k.name]) : item.data[k.name]).join(' ');
        const value = this.columnsMap[y] && this.columnsMap[y].labelFormat ? this.columnsMap[y].labelFormat(item.data[y]) : item.data[y];
        const isActive = this.dimensionColumn.every(i => this.activeDims.includes(item.data[i.name]));
        const className = this.activeDims.length ? isActive ? 'active' : 'not-active' : ''
        return `<li class="g2-tooltip-list-item ${className}">
            <span class="g2-tooltip-marker" style="background: ${item.color}"></span>
            <span class="g2-tooltip-name">${name}</span><span class="g2-tooltip-value">${value}</span>
          </li>`;
      }).join('');
      return `
      <div class="g2-tooltip">
        <div class="g2-tooltip-title">${title}</div>
        <ul class="g2-tooltip-list">
          ${dataStr}
        </ul>
      </div>
      `;
    }
  }
  activeDims: string[] = [];

  constructor(
    public container: HTMLElement,
    public dataSource: DataSource,
    config: {[k: string]: any} = {}
  ) {
    super(container, dataSource, config);
    this.initChannel();
    this.elementActive();
  }

  initChannel() {
    let count = 0;
    this.dimensionColumn.map(item => {
      const channel = item.channel && this.channels.includes(item.channel) ? item.channel : this.channels[count++ % this.channels.length];
      this.channelFields[channel] = this.channelFields[channel] || [];
      this.channelFields[channel].push(item.name);
    });
  }

  elementActive() {
    this.chart.on('element:statechange', (ev) => {
      const intervalElement = ev.target.get('element');
      const data = intervalElement.getModel().data; // 单条数据
      const { element, state, stateStatus } = ev.gEvent.originalEvent;
      if (state === 'active' && stateStatus && data[0]) {
        this.activeDims = this.dimensionColumn.map(k => data[0][k.name]);
      }
      if (state === 'active' && !stateStatus) {
        this.activeDims = [];
      }
      // console.log(element, state, stateStatus)
    });
  }

  draw() {
    const geometry = this.chart.line() as Geometry;
    console.log(this.chart)
    console.log(geometry)
    geometry.position(Object.keys(this.axisOpts).join('*'));
    Object.keys(this.channelFields).forEach(channel => {
      geometry[channel]({
        fields: this.channelFields[channel],
        ...(this.channelOpt[channel] || {})
      });
    });
    this.chart.tooltip(this.toolTipOpt);
    this.chart.removeInteraction('legend-active')
    this.chart.interaction('element-active')
    this.chart.interaction('legend-highlight-a')
    this.chart.interaction('element-highlight')
    this.chart.data(this.dataSource.data);
    super.draw();
  }
}
