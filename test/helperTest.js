var should = require('chai').should(),
    expect = require('chai').expect;

var Helper = require('../src/helper');

describe('Helper compiler', function () {
  it('should execute helper', function (done) {
    var data = {
      foo: function () {
        return 1 + 1
      }
    };

    expect(Helper.compile('{{#foo}}{{/foo}}', data)).to.eql('2');
    done();
  });

  it('should execute helper with parameters', function (done) {
    var data = {
      foo: function (a, b) {
        return parseInt(a) + parseInt(b);
      }
    };

    expect(Helper.compile('{{#foo}}1,1{{/foo}}', data)).to.eql('2');
    done();
  });
});