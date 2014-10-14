'use strict';

var slayer = require('../../index.js');
var path = require('path');
var fs = require('fs');
var sinon = require('sinon');
var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var DEFAULTS = {
  minPeakDistance: 30,
  minPeakHeight: 4.1
};

describe('Slayer.fromStream', function(){
  var filepath = path.join(__dirname, '..', 'fixtures', 'series.txt');

  it('should be able to consume a ReadableStream', function(done){
    slayer().fromStream(fs.createReadStream(filepath)).on('end', done);
  });

  it('should decode 536 values', function(done){
    var spy = sinon.spy();

    slayer()
      .y(function(line){
        var match = 'val:  ';
        var index = line.lastIndexOf(match);

        return index > -1 ? line.slice(index + match.length) : null;
      })
      .fromStream(fs.createReadStream(filepath))
      .on('data', spy)
      .on('end', function(){
        expect(spy).to.have.callCount(536);

        done();
      });
  });
});
