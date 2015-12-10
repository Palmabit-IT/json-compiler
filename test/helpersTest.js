var should = require('chai').should(),
    expect = require('chai').expect;

var Helpers = require('../helpers');

describe('Apply helpers to compiled template', function () {
  var data = {
    increment: function (param) {
      return parseInt(param) + 1;
    },
    sum: function (a, b) {
      return parseInt(a) + parseInt(b);
    }
  };

  it('should execute helper after compiling', function (done) {
    var template = {
      a: {
        b: '[[#increment]] 1 [[/increment]]'
      }
    };

    expect(Helpers.compile(template, data)).to.eql({
      a: {
        b: '2'
      }
    });

    done();
  });

  it('should execute helper with arguments', function (done) {
    var template = {
      a: '[[#sum]] 1,2 [[/sum]]'
    };

    expect(Helpers.compile(template, data)).to.eql({
      a: '3'
    });

    done();
  });
});