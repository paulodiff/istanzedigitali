var chai = require('chai');
var chaiHttp = require('chai-http');
// var server = require('../istanze.js');
var server = 'http://localhost:9988'
var should = chai.should();
var fs = require('fs');

chai.use(chaiHttp);


describe('List of calls ...', function() {
    /*
    it('should exec  /protocollo/getInfoIstanza/f24 GET', function(done) {
        chai.request(server)
            .get('/protocollo/getInfoIstanza/f24')
            .end(function(err, res){
                // console.log(err);
                // console.log(res);
                res.should.have.status(200);
                done();
          });
      });
      */

      it('should exec upload  testn /protocollo/upload', function(done) {
        chai.request(server)
            .post('/protocollo/upload/f24')
            .field("fields[nomeRichiedente]", 'MARIO')
            .field('fields[cognomeRichiedente]', 'ROSSI')
            .field('fields[codiceFiscaleRichiedente]', 'RGGRGR40E25H999A')
            .field('fields[dataNascitaRichiedente]', '01/01/2000')
            .field('fields[emailRichiedente]', 'ruggero.ruggeri@comune.rimini.it')
            .field('fields[capRichiedente]', '0541')
            .field('fields[indirizzoRichiedente]', 'VIA ROMA')
            .field('fields[cittaRichiedente]', 'RIMINI')
            .field('fields[recapitoTelefonicoRichiedente]', '054654654654564')
            .attach('fields[file1]', fs.readFileSync('test/minimal.pdf'), 'minimal.pdf')
            .attach('fields[file2]', fs.readFileSync('test/minimal.pdf'), 'minimal.pdf')
            .attach('fields[file3]', fs.readFileSync('test/minimal.pdf'), 'minimal.pdf')

            .end(function(err, res){
                if (err) console.log(err);
                // console.log(res);
                res.should.have.status(200);
                done();
          });
      });
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});