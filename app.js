const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/TreeShop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Đã kết nối đến MongoDB'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view')); // Đảm bảo đường dẫn tới thư mục views đúng

// Tạo schema cho cây và model
const treeSchema = new mongoose.Schema({
  treename: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }
});

const Tree = mongoose.model('Tree', treeSchema);

// Route trang chủ
app.get('/', async (req, res) => {
  try {
    const trees = await Tree.find(); // Sử dụng async/await để lấy cây từ MongoDB
    res.render('index', { trees });
  } catch (err) {
    res.send('Lỗi khi lấy danh sách cây: ' + err);
  }
});

// Route trang About
app.get('/about', (req, res) => {
  res.render('about');
});

// Thêm thông tin cây vào MongoDB
app.post('/addTree', async (req, res) => {
  const { treename, description, image } = req.body;

  if (!treename || !description) {
    return res.send('Tên cây và mô tả là bắt buộc.');
  }

  const newTree = new Tree({ treename, description, image });

  try {
    await newTree.save(); // Lưu thông tin cây vào MongoDB
    res.redirect('/');
  } catch (err) {
    res.send('Lỗi khi lưu thông tin cây: ' + err);
  }
});

// Xóa toàn bộ dữ liệu trong database
app.get('/reset', async (req, res) => {
  try {
    await Tree.deleteMany({}); // Xóa tất cả cây trong MongoDB
    res.redirect('/');
  } catch (err) {
    res.send('Lỗi khi xóa dữ liệu: ' + err);
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
