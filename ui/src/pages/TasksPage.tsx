import React, { useState, useEffect, use } from 'react';
import {
  Box,
  Typography,
  Paper,
  Fab,
  Alert,
  Chip, Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { tasksAPI } from '../services/tasksService';
import type { Task } from '../services/tasksService';
import TaskCard from '../components/TaskCard';
import TaskDialog from '../components/TaskDialog';
import LoadingSpinner from '../components/LoadingSpinner';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await tasksAPI.getAllTasks();
      setTasks(fetchedTasks);
      setFilteredTasks(fetchedTasks);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
      try {
        let filteredTasks: Task[] = [];
        const allTasks = tasks;

        // Apply status filter
        if (filter === 'all') {
          filteredTasks = allTasks;
        } else if (filter === 'pending') {
          filteredTasks = allTasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
          filteredTasks = allTasks.filter(task => task.completed);
        }

        // Apply priority filter
        if (priorityFilter !== 'all') {
          filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }

        setFilteredTasks(filteredTasks);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
      } 
  }, [filter, priorityFilter, tasks]); // Added priorityFilter and tasks to dependencies

  const handleCreateTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.deleteTask(taskId);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      setFilteredTasks(filteredTasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleMarkDone = async (taskId: string) => {
    try {
      const response = await tasksAPI.markTaskAsDone(taskId);
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? response.task : task
      );
      setTasks(updatedTasks);
      
      // Update filtered tasks as well
      const updatedFilteredTasks = filteredTasks.map(task => 
        task.id === taskId ? response.task : task
      );
      setFilteredTasks(updatedFilteredTasks);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark task as done');
    }
  };

  const handleDialogClose = async (success?: boolean) => {
    setDialogOpen(false);
    setEditingTask(null);
    if (success) {
      await fetchTasks(); // Refresh the task list
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Tasks
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Stack direction="row" spacing={1}>
          <Chip 
            label="All" 
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'filled' : 'outlined'}
            color={filter === 'all' ? 'primary' : 'default'}
          />
          <Chip 
            label="Pending" 
            onClick={() => setFilter('pending')}
            variant={filter === 'pending' ? 'filled' : 'outlined'}
            color={filter === 'pending' ? 'primary' : 'default'}
          />
          <Chip 
            label="Completed" 
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'filled' : 'outlined'}
            color={filter === 'completed' ? 'primary' : 'default'}
          />
        </Stack>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | 'low' | 'medium' | 'high')}
          >
            <MenuItem value="all">All Priority</MenuItem>
            <MenuItem value="low">🟢 Low</MenuItem>
            <MenuItem value="medium">🟡 Medium</MenuItem>
            <MenuItem value="high">🔴 High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {tasks.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tasks yet. Create your first task!
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onMarkDone={handleMarkDone}
            />
          ))}
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add task"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleCreateTask}
      >
        <AddIcon />
      </Fab>

      <TaskDialog
        open={dialogOpen}
        task={editingTask}
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default TasksPage;