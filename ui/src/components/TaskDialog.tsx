import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  ToggleButton, ToggleButtonGroup, Typography
} from '@mui/material';
import { TaskPriorityEnum, tasksAPI } from '../services/tasksService';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../services/tasksService';

interface TaskDialogProps {
  open: boolean;
  task?: Task | null;
  onClose: (success?: boolean) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({ open, task, onClose }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>();
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
    setError('');
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEditing && task) {
        const updateData: UpdateTaskDto = {
          title: title !== task.title ? title : undefined,
          description: description !== task.description ? description : undefined, 
          priority,
        };
        await tasksAPI.updateTask(task.id, updateData);
      } else {
        const createData: CreateTaskDto = {
          title,
          priority,
          description: description || undefined,
        };
        await tasksAPI.createTask(createData);
      }
      onClose(true);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} task`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Typography variant="body2" sx={{ mb: 1 }}>Priority</Typography>
          <ToggleButtonGroup
            value={priority}
            exclusive
            onChange={(event, newPriority) => setPriority(newPriority)}
            size="small"
            fullWidth
          >
            <ToggleButton value="low" color="success">Low</ToggleButton>
            <ToggleButton value="medium" color="warning">Medium</ToggleButton>
            <ToggleButton value="high" color="error">High</ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !title.trim()}
          >
            {isLoading 
              ? (isEditing ? 'Updating...' : 'Creating...') 
              : (isEditing ? 'Update' : 'Create')
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog;