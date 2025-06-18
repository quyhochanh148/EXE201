const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const httpErrors = require('http-errors');
const db = require('./src/models');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./src/config/auth.config');
const conversationController = require('./src/controller/conversation.controller'); // Import controller
require('dotenv').config();
const { schedulePayments } = require('./src/scripts/schedule-payments');

const {
  AuthRouter,
  UserRouter,
  RoleRouter,
  CategoriesRouter,
  BrandRouter,
  ProductRouter,
  ProductReviewRouter,
  AddressRouter,
  CartRouter,
  DiscountRouter,
  CouponRouter,
  OrderRouter,
  ShippingRouter,
  PaymentRouter,
  ShopRouter,
  DocumentRouter,
  ShopFollowRouter,
  ConversationRouter,
  UserStatusRouter,
  ProductVariantRouter,
  ProductAttributeRouter,
  GeminiRouter,
  PayOsRouter,
  ShopRevenueRouter,
  BankAccountRouter,
  BlogRouter,  
} = require('./src/routes');

const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Cấu hình CORS
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000', 'https://greengarden-rho.vercel.app'];
const corsMethods = process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
const corsHeaders = process.env.CORS_HEADERS ? process.env.CORS_HEADERS.split(',') : ['Content-Type', 'Authorization', 'x-access-token'];

// Khởi tạo Express và server
const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.IO (bật ở mọi môi trường)
const io = socketIO(server, {
  cors: {
    origin: corsOrigins,
    methods: corsMethods,
    allowedHeaders: corsHeaders,
    credentials: true,
  },
});

// Cấu hình session và passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: corsMethods,
  allowedHeaders: corsHeaders,
}));
app.use(morgan('dev'));
app.use(bodyParser.json());


// Định tuyến API
app.use('/api/gemini', GeminiRouter);
app.use('/api/payment', PaymentRouter);
app.use('/api/payos', PayOsRouter);

// Định tuyến root
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to RESTFul API - NodeJS",
  });
});

// Đăng ký các route
app.use('/api/auth', AuthRouter);
app.use('/api/user', UserRouter);
app.use('/api/role', RoleRouter);
app.use('/api/categories', CategoriesRouter);
app.use('/api/brand', BrandRouter);
app.use('/api/product', ProductRouter);
app.use('/api/product-review', ProductReviewRouter);
app.use('/api/address', AddressRouter);
app.use('/api/shops', ShopRouter);
app.use('/api/shop-follow', ShopFollowRouter);
app.use('/api/cart', CartRouter);
app.use('/api/discount', DiscountRouter);
app.use('/api/coupon', CouponRouter);
app.use('/api/order', OrderRouter);
app.use('/api/shipping', ShippingRouter);
app.use('/api/payment', PaymentRouter);
app.use('/api/documents', DocumentRouter);
app.use('/api/user-status', UserStatusRouter);
app.use('/api/product-variant', ProductVariantRouter);
app.use('/api/product-attribute', ProductAttributeRouter);
app.use('/api/conversation', ConversationRouter);
app.use('/api/revenue', ShopRevenueRouter);
app.use('/api/bank-account', BankAccountRouter);
app.use('/api/blog', BlogRouter);

// Kiểm soát lỗi
app.use(async (req, res, next) => {
  next(httpErrors.NotFound());
});
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

// Thêm UserStatus model cho trạng thái online
const UserStatus = require('./src/models/user-status.model');

// Hàm cập nhật trạng thái người dùng
async function updateUserOnlineStatus(userId, isOnline) {
  try {
    let userStatus = await UserStatus.findOne({ user_id: userId });

    if (!userStatus) {
      userStatus = new UserStatus({
        user_id: userId,
        is_online: isOnline,
        last_active: new Date(),
      });
    } else {
      userStatus.is_online = isOnline;
      userStatus.last_active = new Date();
    }

    await userStatus.save();

    // Tính toán trạng thái (online, recently, offline)
    const now = new Date();
    const diffMinutes = Math.floor((now - userStatus.last_active) / (1000 * 60));
    let status;
    if (isOnline) {
      status = 'online';
    } else if (diffMinutes < 5) {
      status = 'recently';
    } else {
      status = 'offline';
    }

    io.emit('user-status-changed', {
      userId: userId,
      status: status,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}

// Xử lý Socket.IO
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Xác thực token
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.disconnect();
    return console.log('User not authenticated');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.secret);
    socket.userId = decoded.id;
    console.log('Authenticated user:', socket.userId);
  } catch (error) {
    console.error('Token verification failed:', error);
    socket.disconnect();
    return;
  }

  // Join user to their room
  socket.join(`user-${socket.userId}`);

  // Cập nhật trạng thái online
  updateUserOnlineStatus(socket.userId, true);

  // Handle conversation joining
  socket.on('join-conversation', (conversationId) => {
    socket.join(`conversation-${conversationId}`);
    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  });

  // Handle new message
  socket.on('send-message', async (data) => {
    try {
      const { conversationId, content } = data;
      if (!conversationId || !content) {
        socket.emit('error', { message: 'Invalid data' });
        return;
      }

      // Gọi hàm sendMessage từ controller
      const req = { body: { conversationId, content }, userId: socket.userId };
      const res = {
        status: () => ({ json: (data) => data }),
        json: (data) => data,
      };
      const newMessage = await conversationController.sendMessage(req, res);

      // Broadcast tin nhắn mới
      io.to(`conversation-${conversationId}`).emit('new-message', {
        _id: newMessage._id,
        conversation_id: conversationId,
        sender_id: socket.userId,
        content,
        created_at: new Date(),
        is_read: false,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: error.message });
    }
  });

  // Handle typing
  socket.on('typing', ({ conversationId, isTyping }) => {
    if (!conversationId) return;
    socket.to(`conversation-${conversationId}`).emit('user-typing', {
      userId: socket.userId,
      conversationId,
      isTyping,
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    updateUserOnlineStatus(socket.userId, false);
  });
});

// Khởi động server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  db.connectDB();
  schedulePayments();
});

// Xuất server cho Vercel (nếu cần)
module.exports = server;