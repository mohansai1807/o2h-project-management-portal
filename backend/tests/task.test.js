const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Task = require('../models/Task');

let mongoServer;

beforeAll(async () => {
  // Setup Mongo In-Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear databases before each test
  await User.deleteMany({});
  await Task.deleteMany({});
});

describe('Auth Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should fail to register if user already exists', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'anotheruser',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('already exists');
  });

  it('should authenticate user and return token on login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Task Endpoints', () => {
  let token;
  let user;

  beforeEach(async () => {
    // Create an active user and login to obtain token
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    token = regRes.body.token;
    user = regRes.body.user;
  });

  it('should create a task successfully', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Learn MERN Stack',
        description: 'Creating full-stack applications with React, Express and Node.js',
        status: 'Pending',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Learn MERN Stack');
    expect(res.body.user.toString()).toEqual(user.id);
  });

  it('should fail to create a task with description less than 20 chars', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Learn MERN',
        description: 'Short desc',
        status: 'Pending',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toContain('at least 20 characters');
  });

  it('should retrieve list of tasks for authorized user', async () => {
    await Task.create({
      title: 'First task',
      description: 'First description which is long enough to pass validation.',
      status: 'Pending',
      user: user.id,
    });

    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.tasks).toHaveLength(1);
    expect(res.body.tasks[0]).toHaveProperty('title', 'First task');
  });

  it('should update task status', async () => {
    const task = await Task.create({
      title: 'First task',
      description: 'First description which is long enough to pass validation.',
      status: 'Pending',
      user: user.id,
    });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Completed' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('Completed');
  });

  it('should delete a task successfully', async () => {
    const task = await Task.create({
      title: 'First task',
      description: 'First description which is long enough to pass validation.',
      status: 'Pending',
      user: user.id,
    });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deleted successfully');

    const dbTask = await Task.findById(task._id);
    expect(dbTask).toBeNull();
  });
});
