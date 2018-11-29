const expect = require('chai').expect;

const Compiler = require('../index');

describe('Json-compiler', function () {
  const helpers = {
    calc: function () {
      return 1 + 2;
    },
    sum: function (a, b) {
      return parseInt(a) + parseInt(b);
    }
  };

  it('should replace strings', function (done) {
    const data = {
      foo: {
        bar: 'foo_bar'
      },
      bar: 'bar_bar'
    };
    const template = {
      'foo_{{foo.bar}}': {
        'bar_{{foo.bar}}': {
          foo: '{{bar}}',
          bar: 'bar_{{bar}}'
        }
      }
    };

    expect(Compiler.compile(template, data)).to.eql({
      foo_foo_bar: {
        bar_foo_bar: {
          foo: 'bar_bar',
          bar: 'bar_bar_bar'
        }
      }
    });
    done();
  });

  it('should compile data with helpers and functions', function (done) {
    const data = {
      foo: {
        bar: 'foo_bar'
      }
    };
    const template = {
      foo: '{{calc}}',
      bar: '{{foo.bar}}',
      sum: '{{#sum}}{{calc}},{{calc}}{{/sum}}'
    };

    expect(Compiler.compile(template, data, helpers)).to.eql({
      foo: '3',
      bar: 'foo_bar',
      sum: '6'
    });
    done();
  });

  it('should replace with an array', function (done) {
    const data = {
      foo: [
        { foo: 'foo_foo', bar: { foo: 'bar_foo' } },
        { foo: 'foo_bar', bar: { foo: 'bar_bar' } }
      ]
    };
    const template = [
      [
        { foo: 'bar' }, { bar: 'foo' }
      ],
      {
        '[[foo]]': ['foo', { text: '{{bar.foo}}', customAttribute: 'customValue' }]
      }
    ];

    expect(Compiler.compile(template, data)).to.eql([
      [
        { foo: 'bar' }, { bar: 'foo' }
      ],
      ['foo_foo', { text: 'bar_foo', customAttribute: 'customValue' }],
      ['foo_bar', { text: 'bar_bar', customAttribute: 'customValue' }]
    ]);
    done();
  });

  it('should replace with an array and helpers', function (done) {
    const data = {
      foo: [
        { bar: { foo: '1' } },
        { bar: { foo: '2' } }
      ]
    };
    const template = [
      {
        '[[foo]]': [{ text: '{{#sum}}{{bar.foo}},{{bar.foo}}{{/sum}} {{#calc}}{{/calc}}', customAttribute: 'customValue' }]
      }
    ];

    expect(Compiler.compile(template, data, helpers)).to.eql([
      [{ text: '2 3', customAttribute: 'customValue' }],
      [{ text: '4 3', customAttribute: 'customValue' }]
    ]);
    done();
  });
});
