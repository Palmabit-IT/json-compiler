var should = require('chai').should(),
    expect = require('chai').expect;

var Helpers = require('../src/helper_compiler');

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
      foo: '[[#increment]] 1 [[/increment]]'
    };

    expect(Helpers.compile(template, 'foo', data)).to.eql({
      foo: '2'
    });

    done();
  });

  it('should execute helper with arguments', function (done) {
    var template = {
      foo: '[[#sum]] 1,2 [[/sum]]'
    };

    expect(Helpers.compile(template, 'foo', data)).to.eql({
      foo: '3'
    });

    done();
  });

  it('should execute helpers preserving functions', function (done) {
    var template = {
      foo: function () {return 1}
    };

    var compiled = Helpers.compile(template, 'foo', data);

    expect(compiled.foo.toString()).to.eql(template.foo.toString());
    done();
  });

  /*
  it('should execute helper after compiling', function (done) {
    var template = {
      foo: {
        bar: '[[#increment]] 1 [[/increment]]'
      }
    };

    expect(Helpers.compile(template, data)).to.eql({
      foo: {
        bar: '2'
      }
    });

    done();
  });

  it('should execute helper with arguments', function (done) {
    var template = {
      foo: '[[#sum]] 1,2 [[/sum]]'
    };

    expect(Helpers.compile(template, data)).to.eql({
      foo: '3'
    });

    done();
  });

  it('should execute helpers preserving functions', function (done) {
    var template = {
      foo: function () {return 1},
      bar: '[[#sum]] 1,2 [[/sum]]'
    };

    var compiled = Helpers.compile(template, data);

    expect(compiled.foo.toString()).to.eql(template.foo.toString());
    expect(compiled.bar).to.eql('3');
    done();
  });
  */
});