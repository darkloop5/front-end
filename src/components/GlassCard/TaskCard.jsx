import React from "react";

const TaskCard = () => {
  // 👉 Task Data inside same component
  const tasks = [
  {
    _id: "69eca9ff7c6bbcfa5f142f45",
    id: 557,
    title: "Van Life Across America",
    label: "Watch",
    icon: "🏕️",
    reward: 100,
    url: "https://www.youtube.com/watch?v=DWcJFNfaw9c",
    gradient: "linear-gradient(135deg,#f953c6,#b91d73,#8b5cf6)",
  },
  {
    _id: "69eca9ff7c6bbcfa5f142f46",
    id: 558,
    title: "Night Sky Timelapse",
    label: "Watch",
    icon: "🌌",
    reward: 200,
    url: "https://www.youtube.com/watch?v=example1",
    gradient: "linear-gradient(135deg,#8b5cf6,#6d28d9,#ec4899)",
  },


{
  _id: "69eca9ff7c6bbcfa5f142f47",
  id: 559,
  title: "Relaxing Rainy Forest Vibes",
  label: "Watch",
  icon: "🌧️",
  reward: 150,
  url: "https://www.youtube.com/watch?v=example2",
  gradient: "linear-gradient(135deg,#f59e0b,#f97316,#fb923c)",
},

];

  const handleAction = (task) => {
    window.open(task.url, "_blank");
  };

  const completedTasks = [];

  return (
    <div className="grid gap-4">
      {tasks.map((task) => {
        const isCompleted = completedTasks.includes(task._id);

        return (
          <div
            key={task._id}
            className="rounded-[18px] overflow-hidden"
          >
            <div
              style={{
                background:
                  task.gradient ||
                  "linear-gradient(135deg,#667eea,#764ba2)",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* ICON */}
              <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center text-2xl">
                {task.icon || "🎯"}
              </div>

              {/* CONTENT */}
              <div style={{ flex: 1 }}>
                <p className="text-white font-bold text-sm">
                  {task.title}
                </p>
                <p className="text-white font-extrabold text-xl">
                  ৳ {task.reward.toFixed(2)}
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => handleAction(task)}
                disabled={isCompleted}
                className={`px-4 py-2 rounded-xl font-bold ${
                  isCompleted
                    ? "bg-white/20 text-white/50"
                    : "bg-white text-indigo-900"
                }`}
              >
                {isCompleted ? "✅ Done" : "Start"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskCard;