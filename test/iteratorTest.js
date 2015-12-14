var should = require('chai').should(),
    expect = require('chai').expect;

var Iterator = require('../src/iterator');

describe('Object iterator', function () {
  var data = {
    foo: function () {
      return {
        foo: 'bar'
      }
    },
    bar: {
      foo: function () {
        return {
          foo: 'bar'
        }
      }
    }
  };

  it('should iterate object with nested functions', function (done) {
    var compiled = Iterator.iterateObj(data);
    expect(compiled.foo.toString()).to.eql('function () {return {"foo":"bar"}}');
    expect(compiled.bar.foo.toString()).to.eql('function () {return {"foo":"bar"}}');
    done();
  });
});