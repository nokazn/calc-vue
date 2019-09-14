class Queue {
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
      throw new SynataxError('Invald or unexpected token');
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


const vm = new Vue({
  el: '#app',
  data: {
    nums: new Queue(2),
    opes: new Queue(2),
    _num: '',
    ope: '',
    _tmpFormula: '',
    _formulaHistory: '',
    answer: ''
  },
  computed: {
    num: {
      get () {
        return this.$data._num;
      },
      set (val) {
        if (val.replace(/\.|-/, '').length <= 16) {
          if (this.$data._num === '' && val === '0') {
            this.$data._num = '';
          } else if (this.$data._num === '' && val === '.') {
            this.$data._num = '0.';
          } else if (!this.$data._num.includes('.') || val.slice(-1) !== '.') {
            this.$data._num = val;
          }
        }
      }
    },
    formulaHistory () {
      return `${this.$data._formulaHistory}${this.$data._tmpFormula}`;
    },
    formula () {
      return `${this.nums.get(0)}${this.opes.get(1)}(${this.nums.get(1)})`;
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onInput);
  },
  destroyed () {
    window.removeEventListener('keydown', this.onInput);
  },
  filters: {
    toZero (num) {
      return num || '0';
    },
    // TODO
    digits (num) {
      return num.slice(0, 16);
    },
    addCommas (num) {
      const replace = num => {
        return num.replace(/(^-?(?:\d)+)(\d{3})($|(?:\.|,\d))/, (match, ...p) => {
          const answer = `${p[0]},${p.slice(1, 3).join('')}`;
          return match ? replace (answer) : answer;
        });
      };
      return replace(num);
    }
  },
  methods: {
    onInput (e) {
      if (/^[0-9]$|\./.test(e.key)) this.onNum(e.key);
      else if (/^\+|-|\*|\/$/.test(e.key)) this.onBinaryOpe(e.key);
      else if (e.key === 'Escape') this.onClearAll();
      else if (e.key === 'Delete') this.onCancel();
      else if (e.key === 'Backspace') this.onBackSpace();
      else if (e.key === '=' || e.key === 'Enter') this.onEqu();
      else if (e.key === 'F9') this.onUnaryOpe('negate');
      // console.log(e);
      console.log({nums: this.nums._q, num: this.num, opes: this.opes._q, ope: this.ope});
      console.log(this.nums._q);
      console.log(this.opes._q);
      console.log(this.answer);
    },
    onNum (num) {
      // 演算子が確定したので opes に格納する
      if (this.ope) {
        this.opes.enqueue(this.ope);
        this.ope = '';
        this.num = num;
      } else {
        this.num += num;
      }
      this.updateFormulaHistroy();
    },
    onUnaryOpe (callback) {
      const modules = {
        percent (num) {
          return num / 100;
        },
        root (num) {
          return Math.sqrt(num);
        },
        square (num) {
          return Math.pow(num, 2);
        },
        // TODO
        reciprocal (num) {
          return num !== 0 ? 1 / num : NaN;
        },
        negate (num) {
          return num * -1;
        }
      };
      if (this.num) {
        this.answer = String(modules[callback](Number(this.num)));
        this.num = '';
      } else if (this.answer) {
        this.answer = String(modules[callback](Number(this.answer)));
      }
    },
    onBinaryOpe (ope) {
      // 1つ目の数字が確定したので nums に格納する
      if (!this.ope) {
        this.nums.enqueue(this.num || this.answer || '0');
      }
      this.ope = ope;
      if (this.nums.get(0) && this.nums.get(1) && this.opes.get(1)) {
        this.num = '';
        this.calc();
      }
      this.updateTmpFormula(this.num || this.nums.get(0) || this.answer || 0, ope);
    },
    onEqu () {
      if (this.nums.get(1)) {
        this.nums.enqueue(this.num || (this.ope ? this.answer : this.nums.get(0)));
        this.num = '';
        if (!this.opes.get(1)) {
          this.opes.enqueue(this.ope || this.opes.get(0));
          this.ope = '';
        }
        this.calc();
      }
      this.initFormulaHistory();
    },
    onClearAll () {
      this.initFormulaHistory();
      this.nums.dequeue(2);
      this.num = '';
      this.ope = '';
      this.answer = '';
    },
    onCancel () {
      this.num = '';
    },
    onBackSpace () {
      this.num = this.num.slice(0, -1);
    },
    updateTmpFormula (num, ope) {
      this.$data._tmpFormula = num >= 0 ? `${num}${ope}` : `(${num})${ope}`;
    },
    updateFormulaHistroy () {
      this.$data._formulaHistory += this.$data._tmpFormula;
      this.$data._tmpFormula = '';
    },
    initFormulaHistory () {
      this.$data._tmpFormula = '';
      this.$data._formulaHistory = '';
    },
    calc () {
      this.answer = (new Function(`'use strict'; return ${this.formula}`))().toString();
      this.nums.enqueue(this.answer);
      this.opes.dequeue();
    }
  }
});
