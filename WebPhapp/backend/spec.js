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


  // // ------------------------------------------------------
  // //             Tests: /api/vi/prescriptions
  // // ------------------------------------------------------


  // ensure that given a prescription ID, the get request
  //   returns the associated prescription info.
  it("test-route-prescriptions-single", function(done) {
    request(server)
      .get("/api/v1/prescriptions/single/2")
      .expect(function didGetPrescription(res) {
        var pres = res.body;

        // assert the prescription ID is in the returned prescription.
        var expectedID = 2;
        if(pres.prescriptionID !== expectedID) {
          throw new Error("Did not return the expected prescription");
        }
        if(typeof pres.writtenDate !== 'string') {
          throw new Error('WrittenDate must be a string field.');
        }

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
        var prescription;
        if(res.body.length < 1) throw new Error('Returned 0 prescriptions. Is this right?'); 
        for(var i = 0; i < res.body.length; i++){
          prescription = res.body[i];

          // check writtenDate type
          if(typeof prescription.writtenDate !== 'string') {
            throw new Error('WrittenDate must be a string field.');
          }
        }
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
  //             Tests: /api/v1/prescriptions/add
  // ------------------------------------------------------

  it("test-route-prescriptions-add", function(done) {
    request(server)
    .post("/api/v1/prescriptions/add")
    .send({
      patientID: 0,
      drugID: 0,
      quantity:"0",
      daysFor:0,
      refillsLeft:0,
      prescriberID:0,
      dispenserID:0
    })
    .expect(200)
    .expect(function(res) {
      if (res.body !== true) throw new Error('Valid prescription was not accepted.');
    })
    .end(done);
  });

  it("test-route-prescriptions-add-bad1", function(done) {
    request(server)
    .post("/api/v1/prescriptions/add")
    .send({
      patientID: 0,
      drugID: 0,
      quantity:"0",
      daysFor:0,
      refillsLeft:0,
      prescriberID:0,
      dispenserID:0,
      extraField:0
    })
    .expect(400)
    .expect(function(res) {
      if (res.body !== false) throw new Error('Too many fields went without validation.');
    })
    .end(done);
  });

  it("test-route-prescriptions-add-bad2", function(done) {
    request(server)
    .post("/api/v1/prescriptions/add")
    .send({
      patientID: "this should not be a string",
      drugID: 0,
      quantity:"0",
      daysFor:0,
      refillsLeft:0,
      prescriberID:0,
      dispenserID:0,
    })
    .expect(400)
    .expect(function(res) {
      if (res.body !== false) throw new Error('fields not properly checked for type.');
    })
    .end(done);
  });

  it("test-route-prescriptions-add-bad3", function(done) {
    request(server)
    .post("/api/v1/prescriptions/add")
    .send({
      drugID: 0,
      quantity:"0",
      daysFor:0,
      refillsLeft:0,
      prescriberID:0,
      dispenserID:0,
    })
    .expect(400)
    .expect(function(res) {
      if (res.body !== false) throw new Error('should not create prescription with missing field.');
    })
    .end(done);
  });

  // ------------------------------------------------------
  //             Tests: /api/vi/dispensers
  // ------------------------------------------------------

  // /api/v1/dispensers/prescriptions/historical/:dispenserID
  it("test-route-dispensers-prescriptions-historical", function(done) {
    request(server)
    .get("/api/v1/dispensers/prescriptions/historical/2")
    .expect(200)
    .expect(function(res) {
      if(res.body.length < 1) throw new Error('Returned 0 prescriptions. Is this right?');
      for(var i = 0; i < res.body.length; i++) {
        // assert the dispenserID is in the returned prescription.
        var expectedID = 2;
        if(res.body[i].dispenserID !== expectedID) {
          throw new Error("Did not return the expected prescription");
        }
        if(typeof res.body[i].writtenDate !== 'string') {
          throw new Error('WrittenDate must be a string field.');
        }
      }
      return true;
    })
    .end(done);
  });

  // /api/v1/dispensers/prescriptions/open/:dispenserID
  it("test-route-dispensers-prescriptions-open", function(done) {
    request(server)
    .get("/api/v1/dispensers/prescriptions/open/1")
    .expect(200)
    .expect(function(res) {
      if(res.body.length < 1) throw new Error('Returned 0 prescriptions. Is this right?');
      for(var i = 0; i < res.body.length; i++) {
        // assert the dispenserID is in the returned prescription.
        var expectedID = 1;
        if(res.body[i].dispenserID !== expectedID) {
          throw new Error("Did not return the expected prescription");
        }
        if(typeof res.body[i].writtenDate !== 'string') {
          throw new Error('WrittenDate must be a string field.');
        }
        if(res.body[i].cancelDate > 0) {
          throw new Error('A cancel date exists for this prescription.');
        }
        if(res.body[i].refills < 1) {
          throw new Error('No refills left for this prescription.');
        }
      }
      return true;
    })
    .end(done);
  });

    // /api/v1/dispensers/prescriptions/all/:dispenserID
it("test-route-dispensers-prescriptions", function(done) {
  request(server)
  .get("/api/v1/dispensers/prescriptions/all/1")
  .expect(200)
  .expect(function(res) {
    if(res.body.length < 1) throw new Error('Returned 0 prescriptions. Is this right?');
    for(var i = 0; i < res.body.length; i++) {
      // assert the dispenserID is in the returned prescription.
      var expectedID = 1;
      if(res.body[i].dispenserID !== expectedID) {
        throw new Error("Did not return the expected prescription");
      }
      if(typeof res.body[i].writtenDate !== 'string') {
        throw new Error('WrittenDate must be a string field.');
      }
    }
    return true;
  })
  .end(done);
});

  it("test-route-dispensers-name", function(done) {
    request(server)
    .get("/api/v1/dispensers/walgreens")
    .expect(200)
    .expect(function(res) {
      var fields;
      for(var i = 0; i < res.body.length; i++){
        fields = new Set([res.body[i].dispenserID, res.body[i].phone, res.body[i].name, res.body[i].location]);
        if(fields.has(undefined)){
          throw new Error('Dispenser fields should be not empty for name "walgreens"');
        }
      }
      return true;
    })
    .end(done);
  });

  it("test-route-dispensers-name-bad", function(done) {
    request(server)
    .get("/api/v1/dispensers/thisismostdefinitelynotadispensername")
    .expect(200)
    .expect(function(res) {
      var fields;
      for(var i = 0; i < res.body.length; i++){
        fields = new Set([res.body[i].dispenserID, res.body[i].phone, res.body[i].name, res.body[i].location]);
        if(fields.length > 1){
          throw new Error('Should not have any dispenser fields for bad dispenserID.');
        }
        if(!fields.has(undefined)){
          throw new Error('Dispenser fields should be empty for bad dispenserID');
        }
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
