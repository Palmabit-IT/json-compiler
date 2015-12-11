var should = require('chai').should(),
    expect = require('chai').expect;

var Compiler = require('../index');

describe('Json compiler', function () {
  var data = {
    foo: {
      bar: [1, 2, 3]
    },
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
      foo: '[[calc]]',
      bar: '[[foo.bar]]'
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
        bar: '[[#sum]]{{a}},{{b}}[[/sum]]'
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
});