const nodefs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const {
  MONGO_URL,
  NODE_ENV
} = process.env;

const uploadPath = path.join('.','.','cache');

let fs = {
  access: Key => nodefs.access(`${uploadPath}/${Key.replace(/\//, '-')}`),
  readFile: Key => nodefs.readFile(`${uploadPath}/${Key.replace(/\//, '-')}`),
  writeFileSync: (Key, payload) => nodefs.writeFileSync(`${uploadPath}/${Key.replace(/\//, '-')}`, payload)
}

if(NODE_ENV !== 'development'){
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  const schema = new Schema({ name: String, payload: String });
  const Storage = mongoose.model('Storage', schema);

  fs = {
    access: () => Promise.resolve(),
    readFile: name => Storage.findOne({ name }),
    writeFileSync: (name, payload) => {
      const storage = Storage.findOne({ name });
      storage.payload = payload;
      return storage.save();
    }
  };
}

exports.fs = fs;
