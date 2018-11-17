// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/

var request = require('supertest');

describe('loading express', function () {
  var server;

  // setup function to reset the server before each test case
  beforeEach(function () {
    delete require.cache[require.resolve('./server')];
    server = require('./server');
  });

  /*
   * teardown function to close the server after each test case.
   * must past mocha 'done' or server does not close.
   */
  afterEach(function (done) {
    server.close(done);
  });

  // Specify all server test functions below...

  // unit test for the basic list return route.
  it('responds with a list to /api/v1/list', function (done) {
  request(server)
    .get('/api/v1/list')
    .expect(function didGetThreeList(res){
      var lst = res.body;
      if (lst.length !== 3)
        throw new Error("Body did not contain list of three elements");
    })
    .end(done);
  });

  // ensure that given a prescription ID, the get request 
  //   returns the associated prescription info.
  it('testSinglePrescriptionRoute', function (done) {
    request(server)
      .get('/api/v1/prescriptions/single/0002')
      .expect(function didGetPrescription(res){
        var pres = res.body;
    
        // assert the prescription ID is in the returned prescription.
        //    it would be best to pass this value to this function somehow.
        var expectedID = '0002';
        if (pres.prescriptionID !== expectedID)
            throw new Error("Did not return the expected prescription");
    
        // assert all fields return some value
        Object.values(pres).forEach(v => {
          if (v === null)
            throw new Error('prescription field empty');
        });
      })
      .end(done);
    });

  // ensures that given a faulty prescription ID, the get request
  //    does not return a prescription.
  it('testBadSinglePrescriptionRoute', function (done) {
    request(server)
      .get('/api/v1/prescriptions/single/1234567898765434567876543')
      .expect(function didGetPrescription(res){
        if (Object.keys(res.body).length !== 0)
            throw new Error("Should not return result on bad Prescription ID");
      })
      .end(done);
    });

  it('testMultiplePrescriptionsRoute', function (done) {
    request(server)
      .get('/api/v1/prescriptions/01')
      .expect(function (res){
        // TODO
        return true;
      })
      .end(done);
    });
  
  it('testBadMultiplePrescriptionsRoute', function (done) {
    request(server)
      .get('/api/v1/prescriptions/012345678909876543234567')
      .expect(function (res){
        // TODO
        null;
      })
      .end(done);
    });

  it('testPatientListRoute', function (done) {
      // no API routes created yet
      request(server)
        .get('/api/vi/patients')
        .expect(404, done)
        .end(done);
    });

  // 404 everything else
  it('404 everything else for now', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});
