// TaskForm Component Unit Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import TaskForm from '../../components/TaskForm';

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render form with all fields', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Due Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Tags/)).toBeInTheDocument();
    });

    test('should show "Create New Task" heading when no initialData', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });

    test('should show "Edit Task" heading when initialData is provided', () => {
      const initialData = {
        title: 'Existing task',
        description: 'Existing description',
      };

      render(
        <TaskForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      );

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });

    test('should populate form with initialData', () => {
      const initialData = {
        title: 'Existing task',
        description: 'Existing description',
        status: 'in-progress',
        priority: 'high',
        dueDate: '2025-12-31T00:00:00.000Z',
        tags: ['work', 'urgent'],
      };

      render(
        <TaskForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      );

      expect(screen.getByDisplayValue('Existing task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('in-progress')).toBeInTheDocument();
      expect(screen.getByDisplayValue('high')).toBeInTheDocument();
      expect(screen.getByDisplayValue('work, urgent')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('should show error when title is empty', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should show error when title is too short', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      await userEvent.type(titleInput, 'AB');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should show error when title is too long', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const longTitle = 'A'.repeat(101);
      await userEvent.type(titleInput, longTitle);

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title cannot exceed 100 characters')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should show error when description is too long', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const descriptionInput = screen.getByLabelText(/Description/);

      await userEvent.type(titleInput, 'Valid title');
      const longDescription = 'A'.repeat(501);
      await userEvent.type(descriptionInput, longDescription);

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Description cannot exceed 500 characters')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('should clear error when user starts typing in field', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText(/Title/);
      await userEvent.type(titleInput, 'New title');

      await waitFor(() => {
        expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    test('should submit form with valid data', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const descriptionInput = screen.getByLabelText(/Description/);
      const statusSelect = screen.getByLabelText(/Status/);
      const prioritySelect = screen.getByLabelText(/Priority/);
      const tagsInput = screen.getByLabelText(/Tags/);

      await userEvent.type(titleInput, 'New Task');
      await userEvent.type(descriptionInput, 'Task description');
      await userEvent.selectOptions(statusSelect, 'in-progress');
      await userEvent.selectOptions(prioritySelect, 'high');
      await userEvent.type(tagsInput, 'work, urgent');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
          status: 'in-progress',
          priority: 'high',
          dueDate: undefined,
          tags: ['work', 'urgent'],
        });
      });
    });

    test('should submit form with only required fields', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      await userEvent.type(titleInput, 'Minimal Task');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Minimal Task',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: undefined,
          tags: [],
        });
      });
    });

    test('should parse tags correctly', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const tagsInput = screen.getByLabelText(/Tags/);

      await userEvent.type(titleInput, 'Task with tags');
      await userEvent.type(tagsInput, 'tag1, tag2,  tag3  , tag4');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['tag1', 'tag2', 'tag3', 'tag4'],
          })
        );
      });
    });

    test('should filter empty tags', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const tagsInput = screen.getByLabelText(/Tags/);

      await userEvent.type(titleInput, 'Task with tags');
      await userEvent.type(tagsInput, 'tag1, , tag2, ,');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: ['tag1', 'tag2'],
          })
        );
      });
    });

    test('should include due date when provided', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const dueDateInput = screen.getByLabelText(/Due Date/);

      await userEvent.type(titleInput, 'Task with due date');
      await userEvent.type(dueDateInput, '2025-12-31');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            dueDate: '2025-12-31',
          })
        );
      });
    });

    test('should trim whitespace from title and description', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText(/Title/);
      const descriptionInput = screen.getByLabelText(/Description/);

      await userEvent.type(titleInput, '  Trimmed Title  ');
      await userEvent.type(descriptionInput, '  Trimmed Description  ');

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Trimmed Title',
            description: 'Trimmed Description',
          })
        );
      });
    });
  });

  describe('Cancel Functionality', () => {
    test('should call onCancel when cancel button is clicked', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    test('should not submit form when cancel is clicked', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Update Mode', () => {
    test('should show "Update Task" button when editing', () => {
      const initialData = {
        title: 'Existing task',
      };

      render(
        <TaskForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      );

      expect(screen.getByText('Update Task')).toBeInTheDocument();
      expect(screen.queryByText('Create Task')).not.toBeInTheDocument();
    });

    test('should update form when initialData changes', () => {
      const { rerender } = render(
        <TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );

      expect(screen.getByLabelText(/Title/)).toHaveValue('');

      const initialData = {
        title: 'Updated task',
        description: 'Updated description',
      };

      rerender(
        <TaskForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      );

      expect(screen.getByLabelText(/Title/)).toHaveValue('Updated task');
      expect(screen.getByLabelText(/Description/)).toHaveValue('Updated description');
    });
  });

  describe('Default Values', () => {
    test('should have default status as "todo"', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const statusSelect = screen.getByLabelText(/Status/);
      expect(statusSelect).toHaveValue('todo');
    });

    test('should have default priority as "medium"', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const prioritySelect = screen.getByLabelText(/Priority/);
      expect(prioritySelect).toHaveValue('medium');
    });
  });
});
