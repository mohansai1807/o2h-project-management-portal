const Task = require('../models/Task');

// @desc    Get all user tasks (with search, status filter, sort, and pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Destructure query options
    const { search, status, sort, page = 1, limit = 6 } = req.query;

    // Build DB query object
    const query = { user: userId };

    // Search query filter (matches title or description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // Build sort options
    let sortOptions = { createdAt: -1 }; // default sorting: newest first
    if (sort) {
      const [field, order] = sort.split(':');
      sortOptions[field] = order === 'asc' ? 1 : -1;
    }

    // Pagination calculations
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute queries
    const totalTasks = await Task.countDocuments(query);
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalTasks / limitNum);

    // Fetch user dashboard statistics (unfiltered by search/status)
    const stats = {
      total: await Task.countDocuments({ user: userId }),
      pending: await Task.countDocuments({ user: userId, status: 'Pending' }),
      progress: await Task.countDocuments({ user: userId, status: 'In Progress' }),
      completed: await Task.countDocuments({ user: userId, status: 'Completed' }),
    };

    res.json({
      tasks,
      currentPage: pageNum,
      totalPages,
      totalTasks,
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    // Server-side validations
    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (!description || description.trim().length < 20) {
      return res.status(400).json({ message: 'Task description must be at least 20 characters long' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Pending',
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task status or details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check task ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Validate description if provided for update
    if (description && description.trim().length < 20) {
      return res.status(400).json({ message: 'Task description must be at least 20 characters long' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check task ownership
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
