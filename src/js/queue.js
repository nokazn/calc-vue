export default class Queue {
  constructor (length) {
    if (typeof length !== 'number') {
      throw new Error('Invalid or unexpected token');
    } else if (length <= 0) {
      throw new Error('Invalid queue length');
    }
    this._q = new Array(length || 0).fill('');
    Object.defineProperty(this, 'length', {
      value: length,
      writable: false
    });
  }

  get (index) {
    if (typeof index !== 'number') {
      throw new SyntaxError('Invald or unexpected token');
    } else if (index < 0 || this.length <= index) {
      throw new RangeError('Invalid index');
    }
    return this._q[index];
  }

  enqueue (val) {
    if (this._q.slice(-1)[0] === '') {
      this._q[this.length - 1] = val;
    } else {
      this._q.splice(0, 1);
      this._q.push(val);
    }
  }

  dequeue (count = 1) {
    if (typeof count !== 'number') {
      throw new SyntaxError('Invalid or unexpected token');
    } else if (count < 0) {
      throw new RangeError('Invalid dequeue count');
    }
    this._q.splice(0, count)
    this._q = this._q.concat(new Array(count).fill(''));
  }
}
