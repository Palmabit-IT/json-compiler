var should = require('chai').should(),
    expect = require('chai').expect;

var dataCompiler = require('../utils/data'),
    array = require('../array');

describe('Json array replace', function () {
  var data = dataCompiler.preCompile({
    arr1: [{a: 'aaa', b: 'bbb', c: 'ccc'}, {a: 'aa2', b: 'bb2', c: 'cc2'}],
    arr2: ['aaa', 'bbb', 'ccc'],
    arr3: {a: 1, b: 2, c: 3},
    foo: {
      bar: [4, 5, 6]
    },
    calc: function () {
      return 1 + 2;
    }
  });


  it('should replace some attributes from an array of objects', function (done) {
    var template = {
      foo: [
        [
          {a1: 'a1'},
          {b1: 'b1'}
        ],
        {
          '[[arr1]]': ['a', {fieldValue: 'b', fieldKey: 'text', style:'style'}]
        }
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: [
        [
          {a1: 'a1'},
          {b1: 'b1'}
        ],
        ['aaa', {text: 'bbb', style:'style'}],
        ['aa2', {text: 'bb2', style:'style'}]
      ]
    });

    done();
  });


  it('should replace an array of objects', function (done) {
    var template = {
      foo: [
        '[[arr1]]'
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: [
        [{a: 'aaa', b: 'bbb', c: 'ccc'}, {a: 'aa2', b: 'bb2', c: 'cc2'}]
      ]
    });

    done();
  });


  it('should replace an array of array', function (done) {
    var template = {
      foo: [
        '[[arr2]]'
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: [
        ['aaa', 'bbb', 'ccc']
      ]
    });

    done();
  });

  it('should replace array from dotted path', function (done) {
    var template = {
      foo: [
        '[[foo.bar]]'
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: [
        ['4', '5', '6']
      ]
    });

    done();
  });

  it('should replace with array', function (done) {
    var template = {
      foo: '[[arr2]]'
    };

    expect(array.compile(template, data)).to.eql({
      foo: ['aaa', 'bbb', 'ccc']
    });

    done();
  });

  it('should replace with object', function (done) {
    var template = {
      foo: '[[arr3]]'
    };

    expect(array.compile(template, data)).to.eql({
      foo: {a: '1', b: '2', c: '3'}
    });

    done();
  });

  it('should not convert object to string', function (done) {
    var template = {
      foo: 'bar [[e]]'
    };

    expect(array.compile(template, data)).to.eql({
      foo: []
    });

    done();
  });

  it('should replace value with function', function (done) {
    var template = {
      foo: [
        'bar [[calc]]',
        '[[calc]]'
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: ['bar 3', '3']
    });

    done();
  });

  it('should replace value with function', function (done) {
    var template = {
      foo: {
        foo: 'bar [[calc]]',
        bar: '[[calc]]'
      }
    };

    expect(array.compile(template, data)).to.eql({
      foo: {
        foo: 'bar 3',
        bar: '3'
      }
    });

    done();
  });
});