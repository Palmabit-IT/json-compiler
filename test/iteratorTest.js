const expect = require('chai').expect;

const Iterator = require('../src/iterator');

describe('Object iterator', function () {
  it('should iterate object', function (done) {
    const data = {
      foo: {
        bar: {
          foo: ['foo', 'bar']
        }
      }
    };

    expect(Iterator.iterateObj(data)).to.eql({
      foo: {
        bar: {
          foo: ['foo', 'bar']
        }
      }
    });
    done();
  });

  it('should compile value string', function (done) {
    const data = {
      foo: 'bar'
    };
    const template = {
      foo: 'bar_{{foo}}'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      foo: 'bar_bar'
    });
    done();
  });

  it('should compile key string', function (done) {
    const data = {
      foo: 'bar'
    };
    const template = {
      'foo_{{foo}}': 'bar'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      foo_bar: 'bar'
    });
    done();
  });

  it('should compile key string with function', function (done) {
    const data = {
      foo: {
        bar: function () {
          return 1 + 1;
        }
      }
    };
    const template = {
      'foo_{{foo.bar}}': 'bar'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      foo_2: 'bar'
    });
    done();
  });

  it('should compile key string when constiable is not found', function (done) {
    const data = {
      foo: 'bar'
    };
    const template = {
      'foo_{{foo.bar}}': 'bar'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      'foo_': 'bar'
    });
    done();
  });

  it('should compile value string with function inside helper', function (done) {
    const data = {
      foo: {
        bar: function () {
          return 1 + 1;
        }
      },
      bar: function (a) {
        return parseInt(a) * 2;
      }
    };
    const template = {
      'foo': '{{#bar}}{{foo.bar}}{{/bar}}'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      'foo': '4'
    });
    done();
  });

  it('should compile key string with function inside helper', function (done) {
    const data = {
      foo: {
        bar: function () {
          return 1 + 1;
        }
      },
      bar: function (a) {
        return parseInt(a) * 2;
      }
    };
    const template = {
      'foo_{{#bar}}{{foo.bar}}{{/bar}}': 'bar'
    };

    expect(Iterator.iterateObj(template, data)).to.eql({
      'foo_4': 'bar'
    });
    done();
  });
});
