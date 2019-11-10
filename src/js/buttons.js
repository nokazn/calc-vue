export default [
  {
    name: 'percent',
    content: '\\(％\\)',
    class: 'unary-ope-button',
    handler: 'onUnaryOpe',
    arg: 'percent'
  },
  {
    name: 'root',
    content: '\\(\\sqrt{x}\\)',
    class: 'unary-ope-button',
    handler: 'onUnaryOpe',
    arg: 'root'
  },
  {
    name: 'square',
    content: '\\(x^{2}\\)',
    class: 'unary-ope-button',
    handler: 'onUnaryOpe',
    arg: 'square'
  },
  {
    name: 'reciprocal',
    content: '\\(\\frac{1}{x}\\)',
    class: 'unary-ope-button',
    handler: 'onUnaryOpe',
    arg: 'reciprocal'
  },
  {
    name: 'allClear',
    content: 'AC',
    class: 'unary-ope-button',
    handler: 'onClearAll',
    arg: null
  },
  {
    name: 'cancel',
    content: 'C',
    class: 'unary-ope-button',
    handler: 'onCancel',
    arg: null
  },
  {
    name: 'clear',
    content: '←',
    class: 'unary-ope-button',
    handler: 'onBackSpace',
    arg: null
  },
  {
    name: 'divide',
    content: '\\(\\div\\)',
    class: 'binary-ope-button',
    handler: 'onBinaryOpe',
    arg: '/'
  },
  {
    name: '7',
    content: '7',
    class: 'num-button',
    handler: 'onNum',
    arg: '7'
  },
  {
    name: '8',
    content: '8',
    class: 'num-button',
    handler: 'onNum',
    arg: '8'
  },
  {
    name: '9',
    content: '9',
    class: 'num-button',
    handler: 'onNum',
    arg: '9'
  },
  {
    name: 'multiple',
    content: '\\(\\times\\)',
    class: 'binary-ope-button',
    handler: 'onBinaryOpe',
    arg: '*'
  },
  {
    name: '4',
    content: '4',
    class: 'num-button',
    handler: 'onNum',
    arg: '4'
  },
  {
    name: '5',
    content: '5',
    class: 'num-button',
    handler: 'onNum',
    arg: '5'
  },
  {
    name: '6',
    content: '6',
    class: 'num-button',
    handler: 'onNum',
    arg: '6'
  },
  {
    name: 'subtract',
    content: '\\(-\\)',
    class: 'binary-ope-button',
    handler: 'onBinaryOpe',
    arg: '-'
  },
  {
    name: '1',
    content: '1',
    class: 'num-button',
    handler: 'onNum',
    arg: '1'
  },
  {
    name: '2',
    content: '2',
    class: 'num-button',
    handler: 'onNum',
    arg: '2'
  },
  {
    name: '3',
    content: '3',
    class: 'num-button',
    handler: 'onNum',
    arg: '3'
  },
  {
    name: 'add',
    content: '\\(+\\)',
    class: 'binary-ope-button',
    handler: 'onBinaryOpe',
    arg: '+'
  },
  {
    name: 'negate',
    content: '\\(\\pm\\)',
    class: 'unary-ope-button',
    handler: 'onUnaryOpe',
    arg: 'negate'
  },
  {
    name: '0',
    content: '0',
    class: 'num-button',
    handler: 'onNum',
    arg: '0'
  },
  {
    name: '.',
    content: '.',
    class: 'unary-ope-button',
    handler: 'onNum',
    arg: ''
  },
  {
    name: '=',
    content: '\\(=\\)',
    class: 'binary-ope-button',
    handler: 'onEqu',
    arg: ''
  },
];