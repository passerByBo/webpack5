import _ from 'lodash';
import './style.css'
import meinv from './meinv.png';
import print from './print';
function component() {
    print();
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], '');
    element.classList.add('hello');
    const meinvEle = new Image();
    meinvEle.src = meinv;
    element.appendChild(meinvEle)
    return element;
}

document.body.appendChild(component());