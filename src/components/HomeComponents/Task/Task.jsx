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
import { useNavigate } from "react-router-dom";
import { useGetUserBalanceQuery } from "../../../redux/services/auth/authApiService";
import { TaskSkeleton } from "../../Skeleton/TaskSkeleton/TaskSkeleton";
import TaskCard from "../../GlassCard/TaskCard";

const Task = () => {
  const { user } = useAuthData();
  const navigate = useNavigate();

  // =========================
  // BALANCE
  // =========================
  const { data: balanceData, isLoading: balanceLoading } =
    useGetUserBalanceQuery(user?.userId, {
      skip: !user?.userId,
    });

  const depositAmount = balanceData?.deposit_balance ?? 0;
  const isBasicUser = depositAmount < 1000;

  // =========================
  // LEVEL SYSTEM (FIXED SAFE)
  // =========================
  const getUserLevelInfo = (deposit) => {
    let config = { level: "Basic", days: 3, tasksPerDay: 2 };

    if (deposit >= 20001) config = { level: "Four", days: 7, tasksPerDay: 15 };
    else if (deposit >= 10001)
      config = { level: "Three", days: 10, tasksPerDay: 10 };
    else if (deposit >= 5001)
      config = { level: "Two", days: 12, tasksPerDay: 8 };
    else if (deposit >= 1000)
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
  // TASK DATA
  // =========================
  const { data: allTask, isLoading: tasksLoading } = useGetTaskQuery(
    user?.userId,
  );

  const { data: completedTasksData } = useGetCompletedTasksQuery(user?.userId);

  const TASKS_DATA = allTask?.data || [];

  const completedIds =
    completedTasksData?.completedTasks?.map((t) => t._id?.toString()) || [];

  const [completeTask] = useCompleteTaskMutation();
  const [payUser] = usePayUserMutation();

  // =========================
  // BASIC RULE (FIXED)
  // =========================
  const BASIC_LIMIT = 6;
  const basicCompleted = completedIds.length >= BASIC_LIMIT;

  // =========================
  // BD DATE SAFE
  // =========================
  const getBDDateOnly = () => {
    const bd = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    );
    bd.setHours(0, 0, 0, 0);
    return bd;
  };

  const today = getBDDateOnly();

  const start = user?.taskStartDate ? new Date(user.taskStartDate) : today;

  const startDateOnly = new Date(start);
  startDateOnly.setHours(0, 0, 0, 0);

  const diffTime = today - startDateOnly;
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const safeDay = Math.max(0, Math.min(currentDay, levelInfo.days - 1));

  // =========================
  // SAFE TASK SLICE (FIXED)
  // =========================
  const tasksPerDay = levelInfo.tasksPerDay || 2;

  const startIndex = safeDay * tasksPerDay;

  const todayTasks = TASKS_DATA.slice(startIndex, startIndex + tasksPerDay);

  // =========================
  // ACTION
  // =========================
  const handleAction = async (task) => {
    if (!user?.userId || !task?._id) return;

    const taskId = task._id.toString();

    if (completedIds.includes(taskId)) return;

    try {
      window.open(task.url, "_blank");

      await Promise.all([
        completeTask({
          userId: user.userId,
          taskId: task._id,
        }).unwrap(),

        payUser({
          userId: user.userId,
          amount: Number(levelInfo.reward.toFixed(2)),
          invite: user?.invite,
        }).unwrap(),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  if (balanceLoading || tasksLoading) {
    return <TaskSkeleton />;
  }

  // =========================
  // PROGRESS (SAFE)
  // =========================
  const todayTaskIds = new Set(todayTasks.map((t) => t._id));

  const todayCompletedCount = completedIds.filter((id) =>
    todayTaskIds.has(id),
  ).length;

  const progressPercent =
    tasksPerDay > 0
      ? Math.min(100, (todayCompletedCount / tasksPerDay) * 100)
      : 0;

  // =========================
  // UI
  // =========================

  return (
    <>
      {/* BASIC FINISH SCREEN */}
      {isBasicUser && basicCompleted ? (
        <GlassCard>
          <div className="space-y-3 flex flex-col items-center">
            <img src={img} width={100} />
            <h4 className="text-white text-center">
              🏆 দারুণ! আপনি ৬টি টাস্ক শেষ করেছেন <br />
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
              Today's Tasks —
            </p>

            <div className="text-right">
              {depositAmount > 0 ? (
                <p className="text-yellow-500 text-[12px] font-bold">
                  Level : {levelInfo.level} 🔥 (2X Return)
                </p>
              ) : (
                <div className="flex flex-col items-end">
                  <p className="text-yellow-400 text-[10px] font-bold animate-pulse">
                    ⚠️ ডিপোজিট করলে ২ গুণ ইনকাম পাবেন
                  </p>
                  <button
                    onClick={() => navigate("/deposit")}
                    className="text-white/70 text-[9px] cursor-pointer"
                  >
                    👉 ডিপোজিট করতে ক্লিক করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {user === null && <TaskCard />}
          {/* TASK LIST */}
          {todayTasks.map((task) => {
            const isCompleted = completedIds.includes(task._id.toString());

            return (
              <div key={task._id} className="rounded-[18px] overflow-hidden">
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
                    <p className="text-white font-bold text-sm">{task.title}</p>
                    <p className="text-white font-extrabold text-xl">
                      ৳ {levelInfo.reward.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => handleAction(task)}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-xl font-bold ${
                      isCompleted
                        ? "bg-white/20 text-white/50"
                        : "bg-white text-purple-900 cursor-pointer"
                    }`}
                  >
                    {isCompleted ? "✅ Done" : "Start"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* COMPLETE MESSAGE */}
          {todayCompletedCount === tasksPerDay && (
            <GlassCard>
              <div className="text-center text-white font-bold">
                🎉 আজকের সব টাস্ক শেষ! <br />⏰ নতুন টাস্ক রাত ১২টার পর আসবে
              </div>
            </GlassCard>
          )}

          {/* PROGRESS */}
          <GlassCardV2 className="flex items-center gap-3">
            <span className="text-white text-xs font-semibold">
              Day {safeDay + 1} Progress: {todayCompletedCount}/{tasksPerDay}
            </span>

            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
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
