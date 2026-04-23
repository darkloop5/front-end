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

const Task = () => {
  const { user } = useAuthData();
  const navigate = useNavigate();

  const { data: balanceData, isLoading: balanceLoading } =
    useGetUserBalanceQuery(user?.userId, {
      skip: !user?.userId,
    });

  const getBDDate = () => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
  };

  // =====================================================
  // 🟢 DYNAMIC LEVEL & REWARD LOGIC
  // =====================================================
  const getUserLevelInfo = (deposit) => {
    let config = { level: "Basic", days: 3, tasksPerDay: 2 };

    if (deposit >= 20001) {
      config = { level: "Four", days: 7, tasksPerDay: 15 };
    } else if (deposit >= 10001) {
      config = { level: "Three", days: 10, tasksPerDay: 10 };
    } else if (deposit >= 5001) {
      config = { level: "Two", days: 12, tasksPerDay: 8 };
    } else if (deposit >= 1000) {
      config = { level: "One", days: 15, tasksPerDay: 6 };
    }

    const totalTasks = config.days * config.tasksPerDay;
    const rewardPerTask = deposit > 0 ? (deposit * 2) / totalTasks : 20;

    return { ...config, reward: rewardPerTask };
  };

  const depositAmount = balanceData?.deposit_balance ?? 0;

  const levelInfo = getUserLevelInfo(depositAmount);

  // =====================================================
  // FETCH & DATA HANDLING
  // =====================================================
  const { data: allTask, isLoading: tasksLoading } = useGetTaskQuery();
  const { data: completedTasksData } = useGetCompletedTasksQuery(user?.userId);

  const TASKS_DATA = allTask?.data || [];
  const completedIds =
    completedTasksData?.completedTasks?.map((t) => t._id?.toString()) || [];

  const [completeTask] = useCompleteTaskMutation();
  const [payUser] = usePayUserMutation();

  // slice
  const bdToday = getBDDate();
  const startDate = user?.taskStartDate
    ? new Date(user.taskStartDate)
    : bdToday;
  const diffTime = Math.max(0, bdToday - startDate);
  const currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const startIndex = currentDay * levelInfo.tasksPerDay;
  const todayTasks = TASKS_DATA.slice(
    startIndex,
    startIndex + levelInfo.tasksPerDay,
  );

  const handleAction = async (task) => {
    if (!user?.userId || !task?._id) return;
    if (completedIds.includes(task._id.toString())) return;
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

  return (
    <>
      {completedIds.length >= levelInfo.days * levelInfo.tasksPerDay ? (
        <GlassCard>
          {" "}
          <div className="space-y-3 flex flex-col items-center">
            {" "}
            <img src={img} width={100} />{" "}
            <h4 className="text-white text-center">
              {" "}
              🎉 Target Completed! Deposit Again To Continue{" "}
            </h4>{" "}
            <button
              onClick={() => navigate("/deposit")}
              className="w-full px-4 py-3 rounded-2xl text-white font-black bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              {" "}
              Deposit Now{" "}
            </button>{" "}
          </div>{" "}
        </GlassCard>
      ) : (
        <div className="space-y-3 mt-3 font-urbanist">
          <div className="flex justify-between items-center px-1">
            <p className="text-white font-bold uppercase text-xs">
              Today's Tasks —{" "}
            </p>
            <div className="text-right">
              {depositAmount > 0 ? (
                <p className="text-yellow-500 text-[12px] font-bold">
                  Level : {levelInfo.level} 🔥
                
                  (2X Return)
                </p>
              ) : (
                <div className="flex flex-col items-end">
                  <p className="text-yellow-400 text-[10px] font-bold animate-pulse">
                    ⚠️ ২ গুণ প্রফিট পেতে প্ল্যান আপডেট করুন
                  </p>
                  <button
                    onClick={() => navigate("/deposit")}
                    className="text-white/70 text-[9px] cursor-pointer hover:text-white transition-all"
                  >
                    👉 ডিপোজিট করতে এখানে ক্লিক করুন
                  </button>
                </div>
              )}
            </div>
          </div>

          {todayTasks.map((task) => {
            const isCompleted = completedIds.includes(task._id.toString());
            return (
              <div key={task._id} className="rounded-[18px] overflow-hidden">
                <div
                  style={{
                    background:
                      task.gradient ||
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
                    className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                      isCompleted
                        ? "bg-white/20 text-white/50"
                        : "bg-white text-indigo-900 active:scale-95"
                    }`}
                  >
                    {isCompleted ? "✅ Done" : task.label || "Start"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Progress Tracking */}
          <GlassCardV2 className="flex items-center gap-3">
            <span className="text-white text-xs font-semibold">
              Day {currentDay + 1} Progress:{" "}
              {
                completedIds.filter((id) =>
                  todayTasks.some((t) => t._id === id),
                ).length
              }
              /{levelInfo.tasksPerDay}
            </span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500"
                style={{
                  width: `${(completedIds.filter((id) => todayTasks.some((t) => t._id === id)).length / levelInfo.tasksPerDay) * 100}%`,
                }}
              />
            </div>
          </GlassCardV2>
        </div>
      )}
    </>
  );
};

export default Task;
