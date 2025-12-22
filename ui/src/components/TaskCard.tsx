import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import type { Task } from '../services/tasksService';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onMarkDone: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMarkDone,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {task.title}
          </Typography>
          <Chip
            label={task.completed ? 'Completed' : 'Pending'}
            color={task.completed ? 'success' : 'default'}
            size="small"
          />
        </Box>
        
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}
        
        <Typography variant="caption" color="text.secondary">
          Created: {formatDate(task.createdAt)}
        </Typography>
        
        {task.completedAt && (
          <Typography variant="caption" color="text.secondary" display="block">
            Completed: {formatDate(task.completedAt)}
          </Typography>
        )}

      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip
          label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          color={
            task.priority === 'high' ? 'error' :
            task.priority === 'medium' ? 'warning' :
            'info'
          }
          size="small"
          variant="outlined"
          sx={{ 
            fontWeight: 500,
            borderWidth: 1.5
          }}
        />
        
        <Box sx={{ display: 'flex' }}>
          <IconButton
            size="small"
            onClick={() => onEdit(task)}
            disabled={task.completed}
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            size="small"
            onClick={() => onDelete(task.id)}
          >
            <DeleteIcon />
          </IconButton>
          
          {!task.completed && (
            <IconButton
              size="small"
              onClick={() => onMarkDone(task.id)}
              color="success"
            >
              <CheckCircleIcon />
            </IconButton>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default TaskCard;