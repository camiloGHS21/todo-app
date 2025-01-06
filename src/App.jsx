import React from 'react';
    import useTodoList from './useTodoList';
    import { useState } from 'react';

    function App() {
      const { tasks, handleDragStart, handleDragOver, handleDrop, addTask, updateTask, deleteTask, taskToDelete } = useTodoList();

      return (
        <div className="container">
          {Object.keys(tasks).map((columnId) => (
            <Column
              key={columnId}
              columnId={columnId}
              tasks={tasks}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
              addTask={addTask}
              updateTask={updateTask}
              deleteTask={deleteTask}
              taskToDelete={taskToDelete}
            />
          ))}
        </div>
      );
    }

    const Column = ({ columnId, tasks, handleDragStart, handleDragOver, handleDrop, addTask, updateTask, deleteTask, taskToDelete }) => {
      const [newTaskText, setNewTaskText] = useState('');

      const handleAddTask = () => {
        if (newTaskText.trim()) {
          addTask(columnId, newTaskText);
          setNewTaskText('');
        }
      };

      return (
        <div
          id={columnId}
          className="column"
          onDragOver={handleDragOver}
          onDrop={(event) => handleDrop(event, columnId)}
        >
          <h2>{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</h2>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="New task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <button onClick={handleAddTask}>Add</button>
          </div>
          {tasks[columnId].map((task) => (
            <Task
              key={task.id}
              task={task}
              handleDragStart={handleDragStart}
              updateTask={updateTask}
              deleteTask={deleteTask}
              columnId={columnId}
              taskToDelete={taskToDelete}
            />
          ))}
        </div>
      );
    };

    const Task = ({ task, handleDragStart, updateTask, deleteTask, columnId, taskToDelete }) => {
      const [text, setText] = useState(task.text);
      const [isEditing, setIsEditing] = useState(false);
      const isDeletePending = taskToDelete && taskToDelete.taskId === task.id && taskToDelete.columnId === columnId;

      const handleTextChange = (e) => {
        setText(e.target.value);
      };

      const handleSave = () => {
        updateTask(columnId, task.id, text);
        setIsEditing(false);
      };

      return (
        <div
          className={`task ${isDeletePending ? 'delete-pending' : ''}`}
          draggable={!isEditing}
          onDragStart={(event) => handleDragStart(event, task)}
          onDoubleClick={() => setIsEditing(true)}
        >
          {isEditing ? (
            <>
              <input type="text" value={text} onChange={handleTextChange} />
              <button onClick={handleSave}>Save</button>
            </>
          ) : (
            <>
              <span>{task.text}</span>
              <button className="delete-button" onClick={() => deleteTask(columnId, task.id)}>
                &times;
              </button>
            </>
          )}
        </div>
      );
    };

    export default App;
