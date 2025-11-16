// TaskItem Component Unit Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../../components/TaskItem';

describe('TaskItem Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Test Task',
    description: 'Test description',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-12-31T00:00:00.000Z',
    tags: ['test', 'sample'],
  };

  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render task with all information', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText(/Status: todo/)).toBeInTheDocument();
  });

  test('should display tags when present', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('sample')).toBeInTheDocument();
  });

  test('should not display tags section when no tags', () => {
    const taskWithoutTags = { ...mockTask, tags: [] };

    const { container } = render(
      <TaskItem
        task={taskWithoutTags}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const tagSection = container.querySelector('.task-tags');
    expect(tagSection).not.toBeInTheDocument();
  });

  test('should call onToggleStatus when checkbox is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggleStatus).toHaveBeenCalledWith('123', 'completed');
  });

  test('should toggle status from completed to todo', () => {
    const completedTask = { ...mockTask, status: 'completed' };

    render(
      <TaskItem
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggleStatus).toHaveBeenCalledWith('123', 'todo');
  });

  test('should check checkbox when task is completed', () => {
    const completedTask = { ...mockTask, status: 'completed' };

    render(
      <TaskItem
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  test('should not check checkbox when task is not completed', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('should call onUpdate when edit button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnUpdate).toHaveBeenCalledWith(mockTask);
  });

  test('should call onDelete when delete button is clicked', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('123');
  });

  test('should apply completed class to title when task is completed', () => {
    const completedTask = { ...mockTask, status: 'completed' };

    render(
      <TaskItem
        task={completedTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).toHaveClass('completed');
  });

  test('should not apply completed class to title when task is not completed', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const title = screen.getByText('Test Task');
    expect(title).not.toHaveClass('completed');
  });

  test('should format due date correctly', () => {
    render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText(/Dec 31, 2025/)).toBeInTheDocument();
  });

  test('should display "No due date" when dueDate is not set', () => {
    const taskWithoutDueDate = { ...mockTask, dueDate: null };

    render(
      <TaskItem
        task={taskWithoutDueDate}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    expect(screen.getByText(/No due date/)).toBeInTheDocument();
  });

  test('should apply correct priority class', () => {
    const { container } = render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const priorityBadge = container.querySelector('.priority-medium');
    expect(priorityBadge).toBeInTheDocument();
  });

  test('should apply correct status class', () => {
    const { container } = render(
      <TaskItem
        task={mockTask}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const taskItem = container.querySelector('.status-todo');
    expect(taskItem).toBeInTheDocument();
  });

  test('should not render description when not provided', () => {
    const taskWithoutDescription = { ...mockTask, description: '' };

    render(
      <TaskItem
        task={taskWithoutDescription}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
        onToggleStatus={mockOnToggleStatus}
      />
    );

    const description = screen.queryByText('Test description');
    expect(description).not.toBeInTheDocument();
  });
});
