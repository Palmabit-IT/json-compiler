var should = require('chai').should(),
    expect = require('chai').expect;

var dataCompiler = require('../src/data_compiler');

describe('Data per-compiler', function () {
  var data = {
    foo: 1,
    bar: {
      foo: 2
    }
  };

  it('should convert all numbers to strings', function (done) {
    expect(dataCompiler.preCompile(data)).to.eql({
      foo: '1',
      bar: {
        foo: '2'
      }
    });

    done();
  });
});