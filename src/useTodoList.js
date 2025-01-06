import { useState } from 'react';
    import { v4 as uuid } from 'uuid';

    const initialTasks = {
      pending: [
        { id: uuid(), text: 'Task 1' },
        { id: uuid(), text: 'Task 2' },
      ],
      inProgress: [
        { id: uuid(), text: 'Task 3' },
      ],
      completed: [
        { id: uuid(), text: 'Task 4' },
      ],
    };

    function useTodoList() {
      const [tasks, setTasks] = useState(initialTasks);
      const [draggedTask, setDraggedTask] = useState(null);
      const [taskToDelete, setTaskToDelete] = useState(null);

      const handleDragStart = (event, task) => {
        setDraggedTask({ task, sourceColumnId: event.currentTarget.parentElement.id });
        event.dataTransfer.setData('text/plain', task.id);
      };

      const handleDragOver = (event) => {
        event.preventDefault();
      };

      const handleDrop = (event, targetColumnId) => {
        event.preventDefault();
        if (draggedTask) {
          const { task, sourceColumnId } = draggedTask;
          if (sourceColumnId !== targetColumnId) {
            setTasks(prevTasks => {
              const newTasks = { ...prevTasks };
              const taskIndex = newTasks[sourceColumnId].findIndex(t => t.id === task.id);
              if (taskIndex > -1) {
                const [movedTask] = newTasks[sourceColumnId].splice(taskIndex, 1);
                newTasks[targetColumnId].push(movedTask);
              }
              return newTasks;
            });
          }
          setDraggedTask(null);
        }
      };

      const addTask = (columnId, text) => {
        const newTask = { id: uuid(), text };
        setTasks(prevTasks => ({
          ...prevTasks,
          [columnId]: [...prevTasks[columnId], newTask],
        }));
      };

      const updateTask = (columnId, taskId, newText) => {
        setTasks(prevTasks => ({
          ...prevTasks,
          [columnId]: prevTasks[columnId].map(task =>
            task.id === taskId ? { ...task, text: newText } : task
          ),
        }));
      };

      const deleteTask = (columnId, taskId) => {
        setTaskToDelete({ columnId, taskId });
        setTimeout(() => {
          setTasks(prevTasks => ({
            ...prevTasks,
            [columnId]: prevTasks[columnId].filter(task => task.id !== taskId),
          }));
          setTaskToDelete(null);
        }, 200);
      };

      return {
        tasks,
        handleDragStart,
        handleDragOver,
        handleDrop,
        addTask,
        updateTask,
        deleteTask,
        taskToDelete
      };
    }

    export default useTodoList;
