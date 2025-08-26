// backend/test/example_test.js

const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Task = require('../models/Task');
/**
 * If your controller exports a different name (e.g., addTask),
 * remap it here without changing the rest of the test:
 *   const { addTask: createTask } = require('../controllers/taskController');
 */
const { createTask } = require('../controllers/taskController');

const { expect } = chai;

// Always clean up stubs between tests
afterEach(() => {
  sinon.restore();
});

describe('Task Controller - createTask', () => {
  it('should create a new task successfully', async () => {
    // Mock request
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'New Task', description: 'Task description', deadline: '2025-12-31' },
    };

    // DB returns some created document
    const createdTask = {
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
      // Some projects use userId, some use user; either way the controller will include it.
      userId: req.user.id,
    };

    // Stub model call
    const createStub = sinon.stub(Task, 'create').resolves(createdTask);

    // Mock response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    // Execute
    await createTask(req, res);

    // Assertions (relaxed to match different controller styles)
    expect(createStub.calledOnce).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    // If status was set, accept 201 or 200
    if (res.status.called) {
      const code = res.status.getCall(0).args[0];
      expect([200, 201]).to.include(code);
    }
  });

  it('should handle errors by throwing or responding with 500', async () => {
    // Force the model to throw
    sinon.stub(Task, 'create').throws(new Error('DB Error'));

    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { title: 'New Task', description: 'Task description', deadline: '2025-12-31' },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    let threw = false;
    try {
      await createTask(req, res);
    } catch (err) {
      threw = true;
      // If your controller uses express-async-handler, it will rethrow
      expect(err).to.be.instanceOf(Error);
      expect(err.message).to.equal('DB Error');
    }

    // If it didn't throw, then it should have responded with 500
    if (!threw) {
      expect(res.status.calledWith(500)).to.be.true;
      // Your controller might send {message:'DB Error'} or {error:'DB Error'}; accept either
      const jsonArg = res.json.getCall(0)?.args[0] || {};
      expect(
        (jsonArg && (jsonArg.message === 'DB Error' || jsonArg.error === 'DB Error'))
      ).to.be.true;
    }
  });
});
