import {
  useCompleteTaskMutation,
  useGetTaskQuery,
  useGetCompletedTasksQuery,
  usePayUserMutation,
} from "../../../redux/services/task/taskApiServices";

import useAuthData from "../../../hooks/useAuthData";
import GlassCardV2 from "../../GlassCard/GlassCardV2";
import GlassCard from "../../GlassCard/GlassCard";
import img from "../../../assets/icon/newbe.png";
import { Link, useNavigate } from "react-router-dom";
import { useGetUserBalanceQuery } from "../../../redux/services/auth/authApiService";
import { TaskSkeleton } from "../../Skeleton/TaskSkeleton/TaskSkeleton";
import TaskCard from "../../GlassCard/TaskCard";

const Task = () => {
  const { user } = useAuthData();
  const navigate = useNavigate();

  // =========================
  // BALANCE & USER DATA
  // =========================
  const { data: balanceData, isLoading: balanceLoading } =
    useGetUserBalanceQuery(user?.userId, {
      skip: !user?.userId,
    });

  const depositAmount = balanceData?.deposit_balance ?? 0;
  const isBasicUser = depositAmount < 500;

  // =========================
  // LEVEL SYSTEM (CONFIG)
  // =========================
  const getUserLevelInfo = (deposit) => {
    let config = { level: "Basic", days: 3, tasksPerDay: 2 };

    if (deposit >= 20001) config = { level: "Four", days: 7, tasksPerDay: 15 };
    else if (deposit >= 10001)
      config = { level: "Three", days: 10, tasksPerDay: 10 };
    else if (deposit >= 5001)
      config = { level: "Two", days: 12, tasksPerDay: 8 };
    else if (deposit >= 500)
      config = { level: "One", days: 15, tasksPerDay: 6 };

    const totalTasks = config.days * config.tasksPerDay;

    return {
      ...config,
      reward: deposit > 0 ? (deposit * 2) / totalTasks : 20,
      totalTasks,
    };
  };

  const levelInfo = getUserLevelInfo(depositAmount);

  // =========================
  // TASK DATA FROM API
  // =========================
  const { data: allTask, isLoading: tasksLoading } = useGetTaskQuery(
    user?.userId,
  );

  const { data: completedTasksData } = useGetCompletedTasksQuery(user?.userId);

  const TASKS_DATA = allTask?.data || [];
  const completedIds =
    completedTasksData?.completedTasks?.map((t) =>
      (t.taskId || t._id || t).toString(),
    ) || [];
    console.log(completedIds);

  const [completeTask] = useCompleteTaskMutation();
  const [payUser] = usePayUserMutation();


  const todayTasks = TASKS_DATA;

  const safeDay = allTask?.currentDay ?? 0;
  const tasksPerDay = allTask?.tasksPerDay ?? 0;
 

  // =========================
  // BASIC LIMIT CHECK
  // =========================
  const BASIC_LIMIT = 6;
  const isBasicAndFinished = isBasicUser && completedIds.length >= BASIC_LIMIT;
  

  // =========================
  // ACTION HANDLER
  // =========================
  const handleAction = async (task) => {
    if (!user?.userId || !task?._id) return;
    const taskId = task._id.toString();
    if (completedIds.includes(taskId)) return;

    try {
      window.open(task.url, "_blank");
      await Promise.all([
        completeTask({ userId: user.userId, taskId: task._id }).unwrap(),
        payUser({
          userId: user.userId,
          amount: Number(levelInfo.reward.toFixed(2)),
          invite: user?.invite,
        }).unwrap(),
      ]);
    } catch (err) {
      console.error("Task Completion Error:", err);
    }
  };

  if (balanceLoading || tasksLoading) return <TaskSkeleton />;
  const todayTaskIds = new Set(todayTasks.map((t) => t._id.toString()));

  const todayCompletedCount = completedIds.filter((id) =>
    todayTaskIds.has(id),
  ).length;

  const progressPercent =
    tasksPerDay > 0
      ? Math.min(100, (todayCompletedCount / tasksPerDay) * 100)
      : 0;

  return (
    <>
      {isBasicAndFinished ? (
        <GlassCard>
          <div className="space-y-3 flex flex-col items-center">
            <img src={img} width={100} alt="congrats" />
            <h4 className="text-white text-center">
              🏆 দারুণ! আপনি বেসিক ৬টি টাস্ক শেষ করেছেন <br />
              আরও ইনকাম করতে এখনই ডিপোজিট করুন
            </h4>
            <button
              onClick={() => navigate("/deposit")}
              className="w-full px-4 py-3 rounded-2xl text-white font-black bg-gradient-to-r from-purple-600 to-indigo-600 cursor-pointer"
            >
              Deposit Now
            </button>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3 mt-3 font-urbanist">
          {/* HEADER */}
          <div className="flex justify-between items-center px-1">
            <p className="text-white font-bold uppercase text-xs">
              Day {safeDay + 1} Tasks —
            </p>
            <div className="text-right">
              {depositAmount > 0 ? (
                <p className="text-yellow-500 text-[12px] font-bold">
                  Level : {levelInfo.level} 🔥 (2X Return)
                </p>
              ) : (
                <Link to="/deposit"><p className="text-yellow-400 text-[10px] font-bold animate-pulse">
                  ⚠️ ডিপোজিট করলে ২ গুণ ইনকাম পাবেন
                </p></Link>
              )}
            </div>
          </div>

          {/* TASK LIST */}
          {todayTasks.length > 0 ? (
            todayTasks.map((task) => {
              const isCompleted = completedIds.includes(task._id.toString());
              return (
                <div
                  key={task._id}
                  className="rounded-[18px] overflow-hidden shadow-lg"
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
                    <div className="w-12 h-12 rounded-[14px] bg-white/20 flex items-center justify-center text-2xl">
                      {task.icon || "🎯"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="text-white font-bold text-sm">
                        {task.title}
                      </p>
                      <p className="text-white font-extrabold text-xl">
                        ৳ {levelInfo.reward.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAction(task)}
                      disabled={isCompleted}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${
                        isCompleted
                          ? "bg-white/20 text-white/50"
                          : "bg-white text-purple-900 cursor-pointer active:scale-95"
                      }`}
                    >
                      {isCompleted ? "✅ Done" : "Start"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
          {!user  && <TaskCard />}

          {user && todayCompletedCount === tasksPerDay && (
            <GlassCard>
              <div className="text-center text-white font-bold">
                🎉 আজকের সব টাস্ক শেষ! <br />⏰ নতুন টাস্ক রাত ১২টার পর আসবে
              </div>
            </GlassCard>
          )}
          {/* PROGRESS BAR */}
          <GlassCardV2 className="flex items-center gap-3">
            <span className="text-white text-xs font-semibold whitespace-nowrap">
              Day {safeDay + 1} Progress: {todayCompletedCount}/{tasksPerDay}
            </span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </GlassCardV2>
        </div>
      )}
    </>
  );
};

export default Task;
