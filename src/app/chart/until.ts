import {DataType} from './interface';


export function isLinearType(type: DataType): boolean {
  return ['Linear', 'Date'].includes(type);
}


export function createNameImage(
  name: string, w: number, h: number,
  cfg?: { font?: string, color?: string, margin?: number, fontSize?: number, a?: number, background?: string }
) {
  return new Promise((resolve, reject) => {
    const {margin = 40, fontSize = 12, a = Math.PI / 4, font = null, color = '#cecece', background = '#fff'} = cfg || {};
    const cos = Math.cos(a);
    const sin = Math.sin(a)
    const width = w * cos + h * sin;
    const height = w * sin + h * cos;
    const cvs = document.createElement('canvas');
    const ctx = cvs.getContext('2d');
    cvs.width = w;
    cvs.height = h ;
    cvs.style.width = w + 'px';
    cvs.style.height = h + 'px';
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h)
    ctx.textBaseline = 'top';
    ctx.font = font || 'sans-serif ' + fontSize + 'px';
    const itemW = ctx.measureText(name).width + margin;
    const itemH = fontSize + margin;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(0, 0, w, h);
    ctx.translate(-h * sin * cos,  h * sin * sin)
    ctx.rotate(-a);
    ctx.fillStyle = color;
    for (let i = 0; i < width / itemW; i++) {
      for (let j = 0; j < height / itemH; j++) {
        ctx.fillText(name, i * itemW + margin / 2, j * itemH + margin / 2);
      }
    }
    cvs.toBlob((blob) => {
      resolve(URL.createObjectURL(blob));
    });
  });
}

export function cartesian(arr: any[][]) {
  return Array.prototype.reduce.call(arr, (a, b) => {
    const ret = [];
    a.forEach((i) => {
      b.forEach((j) => {
        ret.push(i.concat([j]));
      });
    });
    return ret;
  }, [[]]);
}

