const expect = require('chai').expect;

const Helper = require('../src/helper');

describe('Helper compiler', function () {
  it('should execute helper', function (done) {
    const data = {
      foo: function () {
        return 1 + 1
      },
      bar: {
        foo: function () {
          return 1 + 1
        }
      }
    };

    expect(Helper.compile('{{#foo}}{{/foo}}', data)).to.eql('2');
    expect(Helper.compile('{{#bar.foo}}{{/bar.foo}}', data)).to.eql('2');
    done();
  });

  it('should execute helper with parameters', function (done) {
    const data = {
      foo: function (a, b) {
        return parseInt(a) + parseInt(b);
      }
    };

    expect(Helper.compile('{{#foo}}1,1{{/foo}}', data)).to.eql('2');
    done();
  });
});
