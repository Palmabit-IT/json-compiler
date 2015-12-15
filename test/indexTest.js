var should = require('chai').should(),
    expect = require('chai').expect;

var Compiler = require('../index');

describe('Json compiler', function () {
  var data = {
    foo: {
      bar: [1, 2, 3]
    },
    bar: [
      {a: 'aaa', b: 'bbb', c: {cc: 'ccc'}},
      {a: 'aa2', b: 'bb2', c: {cc: 'cc2'}}
    ],
    a: 1,
    b: 2,
    sum: function (a, b) {
      return parseInt(a) + parseInt(b);
    }
  };

  var helpers = {
    calc: function () {
      return 1 + 2;
    }
  };

  it('should add helpers to data', function (done) {
    var template = {
      foo: '{{calc}}',
      bar: '{{foo.bar}}'
    };

    expect(Compiler.compile(template, data, helpers)).to.eql({
      foo: '3',
      bar: ['1', '2', '3']
    });

    done();
  });

  it('should compile', function (done) {
    var template = {
      foo: {
        a: '{{a}}',
        bar: '{{#sum}}{{a}},{{b}}{{/sum}}'
      }
    };

    expect(Compiler.compile(template, data)).to.eql({
      foo: {
        a: '1',
        bar: '3'
      }
    });

    done();
  });

  it('should compile template with function', function (done) {
    var template = {
      foo: function () {
        return {
          foo: '{{a}}',
          bar: '{{#sum}}{{a}},{{b}}{{/sum}}'
        }
      },
      bar: {
        a: '{{a}}'
      }
    };

    var compiled = Compiler.compile(template, data);

    expect(typeof compiled.foo).to.eql('function');
    expect(compiled.foo.toString()).to.eql('function () {return {"foo":"1","bar":"3"}}');
    expect(compiled.bar).to.eql({a: '1'});
    done();
  });

  it('should compile template', function (done) {
    var template = {
      foo: function () {
        return {
          'a_{{a}}': '{{a}}',
          foo: '{{a.b.c}}',
          bar: ['{{foo.bar}}']
        }
      },
      bar: [
        '{{bar}}'
      ]
    };

    var compiled = Compiler.compile(template, data);

    expect(compiled.foo()).to.eql({
      a_1: '1',
      foo: '',
      bar: [
        ['1', '2', '3']
      ]
    });
    expect(compiled.bar).to.eql([
      [
        {a1: 'a1'},
        {b1: 'b1'}
      ],
      ['aaa', {text: 'bbb', style: 'style'}],
      ['aa2', {text: 'bb2', style: 'style'}]
    ]);
    done();
  });
});