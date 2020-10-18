import {registerAction, registerInteraction} from '@antv/g2';
import {createAction} from '@antv/g2/lib/interaction/action';

console.log('legend-highlight-a')

registerInteraction('legend-highlight-a', {
  start: [
    {
      trigger: 'legend-item:mouseenter', action: ['legend-item-highlight:highlight', 'element-highlight:highlight'],
      isEnable(context) {
        console.log(context)
        const target = context.event.target;
        const delegateObject = target.get('delegateObject');
        console.log(delegateObject)
        return false;
      }
    },
  ],
  end: [{trigger: 'legend-item:mouseleave', action: ['legend-item-highlight:reset', 'element-highlight:reset']}],
});

export const obj = {};
registerAction()
