'use strict';

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
  mounted () {
    document.addEventListener('keydown', this.onInput);
  },
  destroyed () {
    document.removeEventListener('keydown', this.onInput);
  },
  data: {
    nums: new Queue(2),
    opes: new Queue(2),
    _num: '',
    maxNumLength: 16,
    ope: '',
    _tmpFormula: {
      num: '',
      ope: ''
    },
    _fixedFormulaHistory: '',
    answer: ''
  },
  computed: {
    /**
     * 入力中の数値
     */
    num: {
      get () {
        return this.$data._num;
      },
      /**
       * 値が入力されたときバリデーションを行う
       * val には入力値ではなく更新する値全部が入っている
       * @param {string} - /[0-9]|\.|-/
       */
      set (val) {
        const inputVal = val.slice(-1);
        // 値をクリアするとき
        if (inputVal === '') {
          this.$data._num = '';
        // 値が入力され、最大文字数未満 の場合
        } else if (this.numLength < this.maxNumLength) {
          // 1桁目の入力の場合
          if (this.$data._num === '') {
            if (inputVal === '0') {
              return false;
            } else if (inputVal === '.') {
              this.$data._num = '0.';
            } else {
              this.$data._num = val;
            }
          // 2桁目以降の入力の場合
          } else {
            if (inputVal === '.') {
              // 複数回目の小数点の入力か、最大文字数目の入力値が小数点の場合
              if (this.$data._num.includes('.') || this.numLength === this.maxNumLength - 1 ) {
                return false;
              } else {
                this.$data._num = val;
              }
            } else {
              this.$data._num = val;
            }
          }
        }
        return true;
      }
    },
    /**
     * 小数点 (.) とマイナス (-) を除いた文字数
     */
    numLength () {
      return this.$data._num.replace(/\.|-/, '').length;
    },
    formulaHistory () {
      return `${this.$data._fixedFormulaHistory}${this.$data._tmpFormula.num}${this.$data._tmpFormula.ope}`;
    },
    formula () {
      return `${this.nums.get(0)}${this.opes.get(1)}(${this.nums.get(1)})`;
    },
    isCalcuatable () {
      return this.nums.get(0) && this.nums.get(1) && this.opes.get(1);
    }
  },
  filters: {
    toZero (num) {
      return num || '0';
    },
    addCommas (num) {
      const replace = num => {
        // p[0] = (マイナス? 数字1回以上), p[1] = (数字3回), p[2] = (終端 | (?: 小数点かコンマ 数字1回))
        return num.replace(/(^-?\d+)(\d{3})($|(?:\.|,\d))/, (match, ...p) => {
          // (マイナス? 数字1回以上) , (数字3回) (終端 | (?: 小数点かコンマ 数字1回))
          const answer = `${p[0]},${p[1]}${p[2]}`;
          // マッチするものがある限り再帰的に呼び出す
          return match ? replace(answer) : answer;
        });
      };
      return replace(num);
    }
  },
  methods: {
    onInput (e) {
      if (/^[0-9]$|\./.test(e.key)) {
        this.onNum(e.key);
      } else if (/^\+|-|\*|\/$/.test(e.key)) {
        this.onBinaryOpe(e.key);
      } else if (e.key === 'Escape') {
        this.onClearAll();
      } else if (e.key === 'Delete') {
        this.onCancel();
      } else if (e.key === 'Backspace') {
        this.onBackSpace();
      } else if (e.key === 'Enter' || e.key === '=') {
        this.onEqu();
      }
    },
    /**
     * 数字が入力された場合
     * @param {string} num - /[0-9]|\./
     */
    onNum (num) {
      if (this.ope) {
        // 二項演算子が確定する
        this.opes.enqueue(this.ope);
        this.ope = '';
        this.updateOpeInFormulaHistroy();
        // 2つ目の数字の記憶を開始する
        this.num = num;
      } else {
        // 1つ目の数字を記憶していく
        this.num += num;
      }
    },
    /**
     * 二項演算子が入力された場合
     * @param {string} - '+' | '-' | '*' | '/'
     */
    onBinaryOpe (ope) {
      if (!this.ope) {
        // 入力値、前回の答え、0 の優先順位で1つ目の数字を確定させ、 nums に格納する
        this.nums.enqueue(this.num || this.answer || '0');
        // 二項演算子が入力されたときに数字も同時に更新する
        this.updateTmpFormula({
          num: this.num || this.answer || '0',
          ope
        });
        this.updateNumInFormulaHistroy();
      } else {
        // 二項演算子の上書きのみを行う
        this.updateTmpFormula({ ope });
      }
      this.ope = ope;
      if (this.isCalcuatable) {
        this.calc();
      }
    },

    /**
     * 単項演算子が入力された場合
     * @param {string} type - 'percent' | 'root' | 'square' | 'reciprocal' | 'negate'
     */
    onUnaryOpe (type) {
      /**
       * @typedef Handler: ({
       *   value: string
       *   formula: number,
       * }) => {
       *  formula: string,
       *  value: string
       * }}
       */
      /**
       * @type {[key: string]: Handler}
       */
      const handlers = {
        percent ({ value }) {
          const answer = value / 100;
          return {
            formula: String(answer),
            value: String(answer)
          };
        },
        root ({ formula, value }) {
          return {
            formula: `√(${formula})`,
            value: String(Math.sqrt(value))
          };
        },
        square ({ formula, value }) {
          return {
            formula: `sqr(${formula})`,
            value: String(Math.pow(value, 2))
          };
        },
        // TODO
        reciprocal ({ formula, value }) {
          return {
            formula: `1/(${formula})`,
            value: value !== 0 ? String(1 / value) : 'NaN'
          };
        },
        negate ({ formula, value }) {
          return {
            formula: `negate(${formula})`,
            value: String(value * -1)
          };
        }
      };
      // 入力中の値か、なければ前回の答えを計算して入力値を更新
      const answer = handlers[type]({
        formula: this.$data._tmpFormula.num || this.num || this.answer || '0',
        value: Number(this.num || this.answer || '0')
      });
      this.num = answer.value;
      this.updateTmpFormula({
        num: answer.formula
      });
      if (this.$data._tmpFormula.ope) {
        this.updateOpeInFormulaHistroy();
      }
    },
    onEqu () {
      if (this.nums.get(1)) {
        /**
         * @todo
         */
        this.nums.enqueue(this.num || (this.ope ? this.answer : this.nums.get(0)));
        if (!this.opes.get(1)) {
          this.opes.enqueue(this.ope || this.opes.get(0));
          this.ope = '';
        }
        this.calc();
      }
      this.initFormulaHistory();
    },
    onClearAll () {
      this.nums.dequeue(2);
      this.opes.dequeue();
      this.num = '';
      this.ope = '';
      this.answer = '';
      this.initFormulaHistory();
    },
    /**
     * 入力中の数字をリセットする
     */
    onCancel () {
      if (this.num) {
        this.num = '';
      } else if (this.answer) {
        this.answer = '';
      }
    },
    /**
     * 直近で入力した数字を削除する
     */
    onBackSpace () {
      console.log(this.num.slice(0, -1))
      this.num = this.num.slice(0, -1);
    },
    /**
     * @param {string} num
     * @param {string} ope
     */
    updateTmpFormula ({num, ope}) {
      if (num != null) {
        // 文字列に数字以外を含み、Number() すると NaN になる場合
        if (Number.isNaN(Number(num))) {
          console.log(num)
          this.$data._tmpFormula.num = num;
        } else {
          this.$data._tmpFormula.num = num >= 0 ? num : `(${num})`;
        }
      }
      if (ope != null) {
        this.$data._tmpFormula.ope = ope
      }
    },
    updateNumInFormulaHistroy () {
      console.log('fixed num');
      console.log(this.$data._tmpFormula.num);
      this.$data._fixedFormulaHistory += this.$data._tmpFormula.num;
      this.$data._tmpFormula.num = '';
    },
    updateOpeInFormulaHistroy () {
      this.$data._fixedFormulaHistory += this.$data._tmpFormula.ope;
      this.$data._tmpFormula.ope = '';
    },
    initFormulaHistory () {
      this.$data._fixedFormulaHistory = '';
      this.$data._tmpFormula = {
        num: '',
        ope: ''
      };
    },
    calc () {
      if (this.isCalcuatable) {
        this.answer = (new Function(`'use strict'; return ${this.formula}`))().toString();
        this.nums.enqueue(this.answer);
        this.opes.dequeue();
        // 答えが出た後に入力値はリセット
        this.num = '';
      } else {
        console.error('this formula is uncalcuatable!');
        console.error({ formula: this.formula });
      }
    }
  }
});
