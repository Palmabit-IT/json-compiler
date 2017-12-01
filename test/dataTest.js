const expect = require('chai').expect;

const dataCompiler = require('../src/data');

describe('Data per-compiler', function () {
  const data = {
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
