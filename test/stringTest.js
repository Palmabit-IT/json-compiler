var should = require('chai').should(),
    expect = require('chai').expect;

var Creator = require('../index');

describe('Json string replace', function () {
  var data = {
    a: 'aaa',
    b: 'bbb',
    c: {
      c: 'ccc2'
    },
    d: 'ddd',
    e: ['eee1', 'eee2'],
    f: {f1: 'fff1', f2: {f3: 'fff2'}}
  };

  it('should replace string', function (done) {
    var template = {
      a: '{{a}}',
      b: '{{b}}'
    };

    expect(Creator.compile(template, data)).to.eql({
      a: 'aaa',
      b: 'bbb'
    });

    done();
  });

  it('should replace nested string', function (done) {
    var template = {
      c: '{{c.c}}'
    };

    expect(Creator.compile(template, data)).to.eql({
      c: 'ccc2'
    });

    done();
  });


  it('should replace key name', function (done) {
    var template = {
      'd_{{d}}': 'ddd'
    };

    expect(Creator.compile(template, data)).to.eql({
      d_ddd: 'ddd'
    });

    done();
  });
});