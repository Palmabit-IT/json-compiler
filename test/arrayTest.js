var should = require('chai').should(),
    expect = require('chai').expect;

var array = require('../array');

describe('Json array replace', function () {
  var data = {
    arr1: [{a: 'aaa', b: 'bbb', c: 'ccc'}, {a: 'aa2', b: 'bb2', c: 'cc2'}],
    arr2: ['aaa', 'bbb', 'ccc'],
    arr3: {a: 'aaa', b: 'bbb', c: 'ccc'},
    foo: {
      bar: ['ddd', 'eee', 'fff']
    },
    calc: function () {
      return 1 + 2;
    }
  };


  it('should replace some attributes from an array of objects', function (done) {
    var template = {
      foo: [
        [
          {a1: 'a1'},
          {b1: 'b1'}
        ],
        {
          '[[arr1]]': ['a', 'b']
        }
      ]
    };

    expect(array.compile(template, data)).to.eql({
      foo: [
        [
          {a1: 'a1'},
          {b1: 'b1'}
        ],
        ['aaa', 'bbb'],
        ['aa2', 'bb2'],
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
        ['ddd', 'eee', 'fff']
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
      foo: {a: 'aaa', b: 'bbb', c: 'ccc'}
    });

    done();
  });

  it('should not convert object to string', function (done) {
    var template = {
      foo: 'bar {{e}}'
    };

    expect(array.compile(template, data)).to.eql({
      foo: 'bar {{e}}'
    });

    done();
  });

  it('should replace value with function', function (done) {
    var template = {
      foo: '[[calc]]'
    };

    expect(array.compile(template, data)).to.eql({
      foo: 3
    });

    done();
  });
});