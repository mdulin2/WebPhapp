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

  // Specify all server test functions below

  it('responds with a list to /api/v1/list', function testSlash(done) {
  request(server)
    .get('/api/v1/list')
    .expect(didGetThreeList)
    .end(done);
  });

  /* // example for future (currently returns 404 on travis for some reason):
  it('200 everything else for now', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(200, done);
  });
  */
});

// res: Response
function didGetThreeList(res){
    var lst = res.body;
    if (lst.length !== 3) throw new Error("Body did not contain list of three elements");
};