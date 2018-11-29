const expect = require('chai').expect;

const stringCompiler = require('../src/string');

describe('String compiler', function () {
  it('should return original string if no variable', function (done) {
    const data = {
      foo: 'bar'
    };

    expect(stringCompiler.compile('foo', data)).to.eql('foo');
    done();
  });

  it('should replace string', function (done) {
    const data = {
      foo: 'bar'
    };

    expect(stringCompiler.compile('{{foo}}', data)).to.eql('bar');
    done();
  });

  it('should replace substring', function (done) {
    const data = {
      foo: 'bar'
    };

    expect(stringCompiler.compile('bar_{{foo}}', data)).to.eql('bar_bar');
    done();
  });

  it('should replace nested string', function (done) {
    const data = {
      foo: {
        foo: 'bar'
      }
    };

    expect(stringCompiler.compile('{{foo.foo}}', data)).to.eql('bar');
    done();
  });

  it('should replace string with function', function (done) {
    const data = {
      foo: function () {
        return 1 + 1;
      }
    };

    expect(stringCompiler.compile('{{foo}}', data)).to.eql('2');
    done();
  });

  it('should replace string with nested function', function (done) {
    const data = {
      foo: {
        foo: function () {
          return 1 + 1;
        }
      }
    };

    expect(stringCompiler.compile('{{foo.foo}}', data)).to.eql('2');
    done();
  });

  it('should replace strings inside helper', function (done) {
    const data = {
      foo: 'bar',
      bar: {
        foo: 'foobar',
        bar: function () {
          return 1 + 1;
        }
      }
    };

    expect(stringCompiler.compile('{{#helper}}{{foo}},{{bar.foo}},{{bar.bar}}{{/helper}}', data)).to.eql('{{#helper}}bar,foobar,2{{/helper}}');
    done();
  });

  it('should replace with void string if variable is not found', function (done) {
    const data = {
      foo: 'bar'
    };

    expect(stringCompiler.compile('bar_{{foo.bar}}', data)).to.eql('bar_');
    done();
  });
});
