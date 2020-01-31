var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
var chuyenObjectID = require('mongodb').ObjectId;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'contact';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trang chủ' });
});

/* GET them du lieu. */
router.get('/them', function(req, res, next) {
  res.render('them', { title: 'Thêm mới dữ liệu' });
});

/* POST them du lieu. */
router.post('/them', function(req, res, next) {
  var ten = req.body.ten, dt = req.body.dt;
  var dulieu01 = {
    "ten": req.body.ten,
    "dienthoai": req.body.dt
  };
  const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Insert some documents
      collection.insert(dulieu01, function(err, result) {
        assert.equal(err, null);
        console.log("Them du lieu thanh cong");
        callback(result);
      });   
  }

  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

    insertDocuments(db, function() {
      client.close();
    });
  });

  res.redirect('/them');
});


/* GET xem du lieu. */
router.get('/xem', function(req, res, next) {

  const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      callback(docs);
    });
  }

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

      findDocuments(db, function(dulieu) {
        res.render('xem', { title: 'Xem dữ liệu', data: dulieu });
        // console.log(dulieu);
        client.close();
      });
  });


});


/* GET xoa du lieu. */
router.get('/xoa/:idxoa', function(req, res, next) {
  var idxoa = chuyenObjectID(req.params.idxoa);
  console.log(idxoa);

  const removeDocument = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('nguoidung');

    collection.deleteOne({ _id : idxoa }, function(err, result) {
      assert.equal(err, null);
      console.log("Remove successful!");
      callback(result);
    });
  }
  //cau lenh xóa
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);  
    const db = client.db(dbName);

    removeDocument(db, function() {
      client.close();
      res.redirect('/xem');
    });
  });
  
});

/* GET sửa du lieu. */
router.get('/sua/:idcansua', function(req, res, next) {
  
  var idcansua = chuyenObjectID(req.params.idcansua);

  const findDocuments = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.find({_id: idcansua}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Tìm Thấy !");
      console.log(docs);
      callback(docs);
    });

  }

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);

    const db = client.db(dbName);

      findDocuments(db, function(dulieu) {
        res.render('sua', { title: 'Sửa dữ liệu', data: dulieu });
        console.log(dulieu);
        client.close();
      });
  });

  // res.render('sua', { title: 'Sửa dữ liệu' });
});

/* GET sửa du lieu. */
router.post('/sua/:idcansua', function(req, res, next) {

  var idcansua = chuyenObjectID(req.params.idcansua);
  var dlieuSua  = {
    "ten" : req.body.ten,
    "dienthoai" : req.body.dt
  }

  console.log(idcansua);
  console.log(dlieuSua);

  const updateDocument = function(db, callback) {
    const collection = db.collection('nguoidung');
    collection.updateOne({ _id : idcansua }
      , { $set: dlieuSua  }, function(err, result) {
      assert.equal(err, null);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
  }

  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    const db = client.db(dbName);
    updateDocument(db, function() {
      client.close();
    });
  });

  res.redirect('/xem');
  // res.render('sua', { title: 'Sửa dữ liệu' });
});


module.exports = router;
