// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/

var request = require("supertest");

describe("loading express", function() {
  var server;

  // setup function to reset the server before each test case
  beforeEach(function() {
    delete require.cache[require.resolve("./server")];
    server = require("./server");
  });

  /*
   * teardown function to close the server after each test case.
   * must past mocha 'done' or server does not close.
   */
  afterEach(function(done) {
    server.close(done);
  });


  // ------------------------------------------------------
  //             Tests: /api/vi/prescriptions
  // ------------------------------------------------------


  // ensure that given a prescription ID, the get request
  //   returns the associated prescription info.
  it("test-route-prescriptions/single", function(done) {
    request(server)
      .get("/api/v1/prescriptions/single/2")
      .expect(function didGetPrescription(res) {
        var pres = res.body;

        // assert the prescription ID is in the returned prescription.
        //    it would be best to pass this value to this function somehow.
        var expectedID = 2;
        if (pres.prescriptionID !== expectedID)
          throw new Error("Did not return the expected prescription");

        // assert all fields return some value
        Object.values(pres).forEach(v => {
          if (v === null) throw new Error("prescription field empty");
        });
      })
      .end(done);
  });

  // ensures that given a faulty prescription ID, the get request
  //    does not return a prescription.
  it("test-route-prescriptions/single-bad", function(done) {
    request(server)
      .get("/api/v1/prescriptions/single/1234567898765434567876543")
      .expect(function didGetPrescription(res) {
        if (Object.keys(res.body).length !== 0)
          throw new Error("Should not return result on bad Prescription ID");
      })
      .end(done);
  });

  it("test-route-prescriptions", function(done) {
    request(server)
      .get("/api/v1/prescriptions/1")
      .expect(function(res) {
        // TODO
        return true;
      })
      .end(done);
  });

  it("test-route-prescriptions-bad", function(done) {
    request(server)
      .get("/api/v1/prescriptions/12345678909876543234567")
      .expect(function(res) {
        // TODO
        null;
      })
      .end(done);
  });


  // ------------------------------------------------------
  //             Tests: /api/vi/patients
  // ------------------------------------------------------


  it("test-route-patients-full", function(done) {
    // test for fully qualified first and last name
    request(server)
      .get("/api/v1/patients?first=jacob&last=krantz")
      .expect(function(res) {
        if(res.body.length <= 1) throw new Error('Should be two or more jacob krantz patients for testing.');
        if([res.body[0].first, res.body[0].last, res.body[0].dob, res.body[0].patientID].includes(undefined)){
          throw new Error('Found empty patient field.');
        }
        return true;
      })
      .end(done);
  });

  it("test-route-patients-full-bad", function(done) {
    // test for fully qualified first and last name
    request(server)
      .get("/api/v1/patients?first=madeupnamethatdoesnotexist&last=asdf")
      .expect(function(res) {
        if(res.body.length !== 0) throw new Error('Returned patient info for input with no matches.');
        return true;
      })
      .end(done);
  });

  it("test-route-patients-first", function(done) {
    // test for fully qualified first and last name
    request(server)
      .get("/api/v1/patients?first=jacob")
      .expect(function(res) {
        if(res.body.length <= 1) throw new Error('Should be two or more jacob patients for testing.');
        if([res.body[0].first, res.body[0].last, res.body[0].dob, res.body[0].patientID].includes(undefined)){
          throw new Error('Found empty patient field.');
        }
        return true;
      })
      .end(done);
  });

  it("test-route-patients-last", function(done) {
    // test for fully qualified last name
    request(server)
      .get("/api/v1/patients?last=krantz")
      .expect(function(res) {
        if(res.body.length <= 1) throw new Error('Should be two or more krantz patients for testing.');
        if([res.body[0].first, res.body[0].last, res.body[0].dob, res.body[0].patientID].includes(undefined)){
          throw new Error('Found empty patient field.');
        }
        return true;
      })
      .end(done);
  });

  it("test-route-patients-null", function(done) {
    // test to ensure all patients are returned when no queries are provided.
    request(server)
      .get("/api/v1/patients")
      .expect(function(res) {
        if(res.body.length <= 5) throw new Error('Should return all patients.');
        return true;
      })
      .end(done);
  });


  // ------------------------------------------------------
  //             Tests: /api/vi/patients
  // ------------------------------------------------------


  it("test-route-patients-id", function(done) {
    // test for patientID that exists
    request(server)
      .get("/api/v1/patients/02")
      .expect(function(res) {
        if([res.body.first, res.body.last, res.body.dob, res.body.patientID].includes(undefined)){
          throw new Error('Found empty patient field.');
        }
        return true;
      })
      .end(done);
  });

  it("test-route-patients-id-bad", function(done) {
    // test for fully qualified first and last name
    request(server)
      .get("/api/v1/patients/0023456543456543234567")
      .expect(function(res) {
        var fields = new Set([res.body.first, res.body.last, res.body.dob, res.body.patientID]);
        if(fields.length > 1){
          throw new Error('Should not have any patient fields for bad patientID.');
        }
        if(!fields.has(undefined)){
          throw new Error('Patient fields should be empty for bad patientID');
        }
        return true;
      })
      .end(done);
  });

  it("test-route-patients-id-bad2", function(done) {
    // test for a patientID input that is of the wrong type
    request(server)
      .get("/api/v1/patients/astring")
      .expect(function(res) {
        var fields = new Set([res.body.first, res.body.last, res.body.dob, res.body.patientID]);
        if(fields.length > 1){
          throw new Error('Should not have any patient fields for bad patientID.');
        }
        if(!fields.has(undefined)){
          throw new Error('Patient fields should be empty for bad patientID');
        }
        return true;
      })
      .end(done);
  });


  // ------------------------------------------------------
  //             Tests: other
  // ------------------------------------------------------


  // 404 everything else
  it("404 everything else for now", function testPath(done) {
    request(server)
      .get("/foo/bar")
      .expect(404, done);
  });
});
