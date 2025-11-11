import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Edit, Trash, Save, X, Plus, Filter } from "lucide-react";

export default function ChecklistApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [filter, setFilter] = useState("all"); // all, active, completed

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { 
      id: Date.now(), 
      text: newTask, 
      done: false,
      createdAt: new Date()
    }]);
    setNewTask("");
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editingText } : t)));
    setEditingId(null);
    setEditingText("");
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.done));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "completed") return task.done;
    return true;
  });

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center p-4">
      <Card className="w-full max-w-lg shadow-xl rounded-2xl">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">✨ Мой Чеклист</h1>
            <p className="text-gray-600">Организуйте свои задачи эффективно</p>
          </div>

          {/* Добавление задачи */}
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Что нужно сделать?..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1 rounded-lg"
            />
            <Button onClick={addTask} className="rounded-lg">
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>

          {/* Фильтры и статистика */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
                className="rounded-lg"
              >
                Все
              </Button>
              <Button
                variant={filter === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("active")}
                className="rounded-lg"
              >
                Активные
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
                className="rounded-lg"
              >
                Выполненные
              </Button>
            </div>
            
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompleted}
                className="text-red-500 hover:text-red-600 rounded-lg"
              >
                Очистить выполненные
              </Button>
            )}
          </div>

          {/* Статистика */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Всего задач: {totalCount}</span>
              <span>Выполнено: {completedCount}</span>
              <span>Осталось: {totalCount - completedCount}</span>
            </div>
            {totalCount > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedCount / totalCount) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Список задач */}
          <ul className="space-y-3">
            {filteredTasks.length === 0 ? (
              <li className="text-center text-gray-500 py-8">
                {filter === "all" 
                  ? "🎉 Пока нет задач! Добавьте первую задачу выше."
                  : filter === "active" 
                  ? "✅ Все задачи выполнены!"
                  : "📝 Нет выполненных задач"}
              </li>
            ) : (
              filteredTasks.map((task) => (
                <li
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    task.done 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-white border border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <button
                      onClick={() => toggleDone(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.done
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {task.done && <Check className="w-3 h-3" />}
                    </button>
                    
                    {editingId === task.id ? (
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
                        className="flex-1"
                        autoFocus
                      />
                    ) : (
                      <span
                        className={`flex-1 cursor-pointer ${
                          task.done ? "line-through text-gray-500" : "text-gray-800"
                        }`}
                        onClick={() => toggleDone(task.id)}
                      >
                        {task.text}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    {editingId === task.id ? (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveEdit(task.id)}
                          className="rounded-lg hover:bg-green-50"
                        >
                          <Save className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg hover:bg-gray-100"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(task.id, task.text)}
                          className="rounded-lg hover:bg-blue-50"
                          disabled={task.done}
                        >
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTask(task.id)}
                          className="rounded-lg hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}