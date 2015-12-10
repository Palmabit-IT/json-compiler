var should = require('chai').should(),
    expect = require('chai').expect;

var Compiler = require('../index');

describe('Json compiler', function () {
  var data = {
    foo: {
      bar: ['aaa', 'bbb', 'ccc']
    }
  };

  var helpers = {
    calc: function () {
      return 1 + 2;
    }
  };

  it('should add helpers to data', function (done) {
    var template = {
      foo: '[[calc]]'
    };

    expect(Compiler.compile(template, data, helpers)).to.eql({
      foo: '3'
    });

    done();
  });
});