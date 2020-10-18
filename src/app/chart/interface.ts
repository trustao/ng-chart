import {Data} from '@antv/g2/lib/interface';


export type DataType = 'Linear' | 'Category' | 'Date';

export interface Column {
  name: string;
  type: 'Dimension' | 'Aggregate';
  dataType: DataType;
  labelFormat?: (value: any) => string;
  channel?: string;
}

export interface DataSource {
  data: Data;
  columns: Column[];
}
