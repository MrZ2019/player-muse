

export default function SqliteDB(name, size=25 * 1024 * 1024) {
  this.db = openDatabase(name, '', 'My Database', size);

  this.exec = function(sql, params, success, error) {

    this.db.transaction(function(tx) {
      tx.executeSql(sql, params, function(tx, res) {
        let data = [];

        for (let i = 0; i < res.rows.length; i++) {
          let item = res.rows.item(i);
          data.push(item);
        }
        success && success(data);
      }, function(tx, err) {
        console.log(err.source + "::" + err.message);
        error && error(err);
      });
    })
  }
}
