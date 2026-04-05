"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine,
  Legend
} from "recharts";
import { 
  Trophy, 
  Settings, 
  Plus, 
  Rocket, 
  Flame, 
  Scale,
  Trash2,
  X,
  Activity,
  ChevronRight,
  Target,
  ArrowDown,
  Calendar,
  Zap,
  Cpu,
  LayoutDashboard,
  Database,
  History,
  TrendingDown,
  ChevronLeft,
  ArrowRightCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { WeightEntry, parseWeightInput } from "@/lib/weight-engine";

export default function WeightAchiever() {
  // --- Navigation State ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "config">("dashboard");

  // --- Core Data State ---
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [achievement, setAchievement] = useState<{msg: string, icon: any} | null>(null);

  // --- Configuration State ---
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("https://api.deepseek.com/v1");
  const [model, setModel] = useState("deepseek-chat");
  const [goalWeight, setGoalWeight] = useState<number | "">("");
  const [isDramatic, setIsDramatic] = useState(true);

  const MODELS = [
    { id: "deepseek-chat", name: "DeepSeek-V3" },
    { id: "deepseek-reasoner", name: "DeepSeek-R1 (推理)" },
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "doubao-pro-32k", name: "豆包 Pro" },
    { id: "qwen-max", name: "通义千问 Max" }
  ];

  // --- Persistence ---
  useEffect(() => {
    const saved = localStorage.getItem("006-weight-entries");
    if (saved) setEntries(JSON.parse(saved));
    const savedKey = localStorage.getItem("006-api-key");
    const savedEnd = localStorage.getItem("006-api-endpoint");
    const savedMod = localStorage.getItem("006-api-model");
    const savedGoal = localStorage.getItem("006-goal-weight");
    if (savedKey) setApiKey(savedKey);
    if (savedEnd) setEndpoint(savedEnd);
    if (savedMod) setModel(savedMod);
    if (savedGoal) setGoalWeight(Number(savedGoal));
  }, []);

  useEffect(() => {
    localStorage.setItem("006-weight-entries", JSON.stringify(entries));
  }, [entries]);

  const saveSettings = () => {
    localStorage.setItem("006-api-key", apiKey);
    localStorage.setItem("006-api-endpoint", endpoint);
    localStorage.setItem("006-api-model", model);
    if (goalWeight !== "") localStorage.setItem("006-goal-weight", goalWeight.toString());
    setActiveTab("dashboard");
  };

  const handleClearData = () => {
    if (window.confirm("确定清除全部数据流？")) {
      setEntries([]);
      localStorage.removeItem("006-weight-entries");
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleAddData = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const records = await parseWeightInput(inputText, apiKey, endpoint, model);
      if (records && records.length > 0) {
        const newEntries: WeightEntry[] = [];
        let totalLossSession = 0;
        let currentTempEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        for (const data of records) {
          if (data.weight) {
            const newEntry: WeightEntry = {
              id: (Date.now() + Math.random()).toString(),
              date: data.date!,
              weight: data.weight,
              bodyFat: data.bodyFat,
              note: data.note,
            };
            if (currentTempEntries.length > 0) {
              const last = currentTempEntries[currentTempEntries.length - 1];
              if (last.weight > newEntry.weight) {
                newEntry.isAchieved = true;
                totalLossSession += (last.weight - newEntry.weight);
              }
            }
            newEntries.push(newEntry);
            currentTempEntries.push(newEntry);
          }
        }
        if (totalLossSession > 0) {
          setAchievement({ msg: `分析成功！成功识别减重波动。`, icon: Trophy });
          setTimeout(() => setAchievement(null), 4000);
        }
        setEntries(prev => [...prev, ...newEntries]);
        setInputText("");
      }
    } catch (error) {
      alert("AI 解析引擎未就绪状态，请检查连接。");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRecord = () => {
    const today = new Date().toISOString().split('T')[0];
    setInputText(`${today} `);
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  const latestEntry = sortedEntries[sortedEntries.length - 1];
  const maxWeight = entries.length > 0 ? Math.max(...entries.map(e => e.weight)) : 0;
  const currentWeight = latestEntry?.weight || 0;
  const currentFat = latestEntry?.bodyFat || 0;
  const totalLoss = entries.length > 1 ? (maxWeight - currentWeight) : 0;

  const progressPercent = useMemo(() => {
    if (!goalWeight || !currentWeight) return 0;
    const initialW = entries.length > 0 ? Math.max(...entries.map(e => e.weight)) : currentWeight;
    const totalGap = initialW - (goalWeight as number);
    if (totalGap <= 0) return 100;
    return Math.min(100, Math.max(0, (totalLoss / totalGap) * 100));
  }, [entries, currentWeight, goalWeight, totalLoss]);

  const chartData = useMemo(() => {
    return sortedEntries.map(e => ({ ...e, displayDate: e.date.substring(5) }));
  }, [sortedEntries]);

  const domainWeight = useMemo(() => {
    if (entries.length === 0) return [0, 100];
    const ws = entries.map(e => e.weight);
    if (goalWeight) ws.push(goalWeight as number);
    const min = Math.min(...ws);
    const max = Math.max(...ws);
    return isDramatic ? [min - 0.2, max + 0.2] : [Math.floor(min - 5), Math.ceil(max + 5)];
  }, [entries, goalWeight, isDramatic]);

  const domainFat = useMemo(() => {
    const fs = entries.map(e => e.bodyFat).filter(Boolean) as number[];
    if (fs.length === 0) return [0, 100];
    return [Math.min(...fs) - 1, Math.max(...fs) + 1];
  }, [entries]);

  return (
    <div className="dashboard-layout bg-[var(--color-bg)]">
      
      {/* ── Sidebar ── */}
      <aside className="sidebar glass !rounded-none !border-r !border-white/5 !bg-zinc-950/40">
        <div className="mb-14 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-glow-strong">
              <Scale className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter gradient-text leading-tight">体重一键记录</h1>
              <p className="text-[9px] uppercase font-black text-zinc-700 tracking-[0.2em] mt-1">(成就版)</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <div className="text-[10px] font-black text-zinc-800 uppercase tracking-widest px-5 mb-4">核心引擎</div>
          <button onClick={() => setActiveTab("dashboard")} className={`sidebar-item ${activeTab === 'dashboard' ? 'active shadow-lg' : ''}`}>
            <LayoutDashboard size={20} /> 分析看板
          </button>
          <button onClick={() => setActiveTab("config")} className={`sidebar-item ${activeTab === 'config' ? 'active shadow-lg' : ''}`}>
            <Cpu size={20} /> 引擎配置
          </button>
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-5">
           <div className="px-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">服务连接状态</span>
                <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-400 shadow-glow' : 'bg-red-500'}`} />
              </div>
              <p className="text-[11px] font-bold text-zinc-400 truncate">{apiKey ? model.toUpperCase() : "未配置密钥"}</p>
           </div>
           <button onClick={handleClearData} className="sidebar-item text-red-500/60 hover:!bg-red-950/20 hover:!text-red-400">
             <Trash2 size={18} /> 清空历史流
           </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="main-content">
        
        {/* ── Compact Header (Visible when Sidebar is hidden) ── */}
        <header className="lg:hidden flex justify-between items-center mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
              <Scale className="text-white" size={18} />
            </div>
            <h1 className="text-lg font-black italic tracking-tighter gradient-text">体重记录</h1>
          </div>
          <button 
            onClick={() => setActiveTab(activeTab === 'dashboard' ? 'config' : 'dashboard')}
            className="p-3 bg-zinc-900 border border-white/5 rounded-2xl text-[var(--color-primary)] shadow-glow"
          >
            {activeTab === 'dashboard' ? <Settings size={20} /> : <LayoutDashboard size={20} />}
          </button>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-10">
              
              {/* Dashboard Header */}
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter mb-2">数据分析看板</h2>
                  <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">精密生物特征监测系统</p>
                </div>
                <div className="text-right pb-1">
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block mb-1">最后同步时间</span>
                  <div className="flex items-center gap-2 text-xs font-mono font-black text-zinc-300">
                    <Clock size={12} className="text-zinc-500" /> {latestEntry?.date || "初始化节点"}
                  </div>
                </div>
              </div>

              {/* Metrics Grid (Equal Height: h-64) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-3 card glass !p-8 h-64 border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">当前体重记录</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">{currentWeight.toFixed(1)}</span>
                    <span className="text-sm font-black text-zinc-600 font-mono tracking-tighter">KG</span>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> 实时数据连通
                  </div>
                </div>

                {/* Hero Card: Total Loss */}
                <div className="md:col-span-6 card glass !p-8 h-64 border-[var(--color-success)]/20 shadow-glow relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Rocket size={140} /></div>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <Flame className="text-[var(--color-success)]" size={16} />
                      <span className="text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em]">累计甩掉赘肉</span>
                    </div>
                    <div className="badge badge-success !bg-emerald-500/10 !text-[9px]">目标达成追踪</div>
                  </div>
                  
                  <div className="flex items-baseline gap-3 relative z-10">
                    <span className="text-7xl font-black tracking-tighter text-[var(--color-success)]">{totalLoss.toFixed(2)}</span>
                    <span className="text-lg font-black text-[var(--color-success)] opacity-40 italic font-mono">KG</span>
                  </div>

                  {goalWeight && (
                    <div className="space-y-3 relative z-10">
                      <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">项目总进度 {progressPercent.toFixed(1)}%</span>
                        <span className="text-[10px] font-black text-[var(--color-success)] uppercase tracking-tight">
                          {currentWeight <= goalWeight ? "已达成预设标杆" : `距目标还差 ${ (currentWeight - Number(goalWeight)).toFixed(1) } KG`}
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-950/60 rounded-full p-[1.5px] border border-white/5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-[var(--color-success)] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-3 card glass !p-8 h-64 border-white/5 flex flex-col justify-between">
                  <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">体脂评估状况</span>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-6xl font-black tracking-tighter text-[hsl(280,80%,65%)]">{currentFat ? currentFat.toFixed(1) : "--"}</span>
                      <span className="text-sm font-black text-zinc-600 font-mono tracking-tighter">%</span>
                    </div>
                    <p className="text-[10px] font-bold text-zinc-700 uppercase leading-relaxed">
                      {currentFat ? `较初始阶段已${currentFat < (sortedEntries[0]?.bodyFat || 0) ? '下降' : '波动'} ${(Math.abs(currentFat - (sortedEntries[0]?.bodyFat || 0))).toFixed(1)}%` : "等待深度数据..."}
                    </p>
                  </div>
                  <div className="badge !bg-purple-900/10 !text-purple-400/60 !text-[8px] tracking-widest">成分分析 AI 流</div>
                </div>
              </div>

              {/* Middle Analysis (Equal Combined Height) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                <div className="lg:col-span-4 card glass !p-8 flex flex-col gap-6 border-white/5 self-stretch">
                   <div className="flex justify-between items-center">
                    <div className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                      <Cpu size={14} className="text-[var(--color-primary)]" /> 处理录入中枢
                    </div>
                    <button onClick={handleQuickRecord} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-[9px] font-black text-white flex items-center gap-2 transition-all border border-white/5 uppercase">
                      <Calendar size={10} /> 快速补录
                    </button>
                  </div>
                  <textarea
                    value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder="例如: 2026-04-05 75.3kg 20%"
                    className="w-full bg-transparent border-none focus:ring-0 text-2xl font-bold p-0 resize-none flex-1 min-h-[220px] leading-snug placeholder:text-zinc-800 text-[var(--color-primary)] selection:bg-blue-500/20"
                  />
                  <div className="space-y-4">
                    <button onClick={handleAddData} disabled={loading} className="btn btn-primary w-full h-16 shadow-glow !text-xs !tracking-[0.2em] font-black">
                      {loading ? <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" /> : <>同步数据线并执行分析 <Zap size={14} fill="white" /></>}
                    </button>
                    <p className="text-[11px] font-bold text-zinc-600 text-center uppercase tracking-widest">数据链路已激活 • 安全本地存储</p>
                  </div>
                </div>

                {/* Chart Right */}
                <div className="lg:col-span-8 card glass !p-8 border-white/5 flex flex-col self-stretch min-h-[520px]">
                   <div className="flex justify-between items-center mb-10">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 italic">多维波动趋势拟合关联图</h3>
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.15em]">系统生物特征分析数据流</p>
                    </div>
                    <div className="flex bg-zinc-950/50 p-1 rounded-xl border border-white/5">
                      <button onClick={() => setIsDramatic(!isDramatic)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all ${isDramatic ? "bg-zinc-800 text-white" : "text-zinc-600"}`}>
                        {isDramatic ? "极化缩放" : "标准比例"}
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 w-full relative h-full">
                    {chartData.length > 1 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -25, bottom: 20 }}>
                          <defs>
                            <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25}/><stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0}/></linearGradient>
                            <linearGradient id="gF" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="hsl(280, 80%, 65%)" stopOpacity={0.15}/><stop offset="100%" stopColor="hsl(280, 80%, 65%)" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                          <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{fill: '#444', fontSize: 9, fontWeight: 900}} dy={15} />
                          <YAxis yAxisId="L" orientation="left" axisLine={false} tickLine={false} tick={{fill: 'var(--color-primary)', fontSize: 9, fontWeight: 900}} domain={domainWeight} padding={{ top: 20, bottom: 20 }} />
                          <YAxis yAxisId="R" orientation="right" axisLine={false} tickLine={false} tick={{fill: 'hsl(280, 80%, 65%)', fontSize: 9, fontWeight: 900}} domain={domainFat} padding={{ top: 20, bottom: 20 }} />
                          <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1a1a1a', borderRadius: '12px', fontSize: '11px', fontWeight: 900 }} cursor={{ stroke: '#222' }} />
                          <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '9px', paddingTop: '30px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                          <Area yAxisId="L" type="monotone" dataKey="weight" name="体重 (KG)" stroke="var(--color-primary)" strokeWidth={4} fill="url(#gW)" dot={{ r: 3, fill: 'var(--color-primary)', strokeWidth: 0 }} />
                          <Area yAxisId="R" type="monotone" dataKey="bodyFat" name="体脂 (%)" stroke="hsl(280, 80%, 65%)" strokeWidth={4} fill="url(#gF)" dot={{ r: 3, fill: 'hsl(280, 80%, 65%)', strokeWidth: 0 }} />
                          {goalWeight && <ReferenceLine yAxisId="L" y={goalWeight as number} stroke="#ef444455" strokeDasharray="8 8" label={{ position: 'left', value: 'TARGET', fill: '#ef444477', fontWeight: 900, fontSize: 8 }} />}
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <Database size={48} className="mb-4" />
                        <span className="text-[10px] font-black uppercase tracking-[1em]">Establishing Data Link...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Historical Archive */}
              <section className="space-y-6 pt-12">
                <div className="flex items-center gap-6 px-2 opacity-20">
                  <div className="h-[1px] flex-1 bg-white" />
                  <span className="text-[10px] font-black uppercase tracking-[1.5em] text-zinc-400">全局自存档审计流</span>
                  <div className="h-[1px] flex-1 bg-white" />
                </div>
                
                <div className="card glass !p-0 overflow-hidden border-white/5">
                  <table className="w-full text-right border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/60 border-b border-white/5 h-16">
                        <th className="px-10 text-left text-[10px] font-black uppercase text-zinc-500 tracking-widest">日期节点</th>
                        <th className="px-10 text-[10px] font-black uppercase text-zinc-500 tracking-widest border-x border-white/5">体重监控 (KG)</th>
                        <th className="px-10 text-[10px] font-black uppercase text-zinc-500 tracking-widest border-x border-white/5">体脂估算 (%)</th>
                        <th className="px-10 text-left text-[10px] font-black uppercase text-zinc-500 tracking-widest">核心行为分析提取</th>
                        <th className="px-10 w-24"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[...entries].sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).map((entry, idx) => (
                        <tr key={entry.id} className={`group h-20 hover:bg-white/[0.04] transition-colors ${idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}`}>
                          <td className="px-10 text-left text-xs font-black text-zinc-500">{entry.date}</td>
                          <td className="px-10 font-mono font-black border-x border-white/5">
                            <div className="flex items-center justify-end gap-4 text-2xl tracking-tighter text-zinc-100">
                              {entry.isAchieved && (
                                <span className="px-2 py-0.5 bg-[var(--color-success)]/10 text-[var(--color-success)] text-[8px] font-black rounded-md border border-[var(--color-success)]/20 uppercase tracking-widest">
                                  下降
                                </span>
                              )}
                              {entry.weight.toFixed(1)}
                            </div>
                          </td>
                          <td className="px-10 font-mono font-black border-x border-white/5 text-xl" style={{ color: entry.bodyFat ? 'hsl(280, 80%, 65%)' : '#222' }}>
                             {entry.bodyFat ? `${entry.bodyFat.toFixed(1)}%` : "--"}
                          </td>
                          <td className="px-10 text-left text-[11px] text-zinc-600 font-bold max-w-md truncate" title={entry.note || ""}>
                            {entry.note || "（未检测到备注）"}
                          </td>
                          <td className="px-10 text-right">
                            <button onClick={() => handleDeleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-2 text-zinc-800 hover:text-red-500 transition-all active:scale-90">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {entries.length === 0 && (
                    <div className="p-20 text-center text-zinc-800 font-black uppercase text-[10px] tracking-[0.6em]">数据终端为空</div>
                  )}
                </div>
              </section>
            </motion.div>
          ) : (
             <motion.div key="config" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-3xl pt-8">
                <header className="mb-14">
                   <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-1 bg-[var(--color-primary)] rounded-full shadow-glow" />
                     <span className="text-[10px] font-black uppercase text-[var(--color-primary)] tracking-[0.4em]">核心引擎链路配置</span>
                   </div>
                   <h2 className="text-5xl font-black italic tracking-tighter gradient-text">智元连接中枢</h2>
                   <p className="text-xs font-black text-zinc-600 mt-4 uppercase tracking-[0.3em]">AI BACKEND & PERSONALIZED PARAMETERS</p>
                </header>

                <div className="space-y-12">
                  <div className="card glass !p-10 border-white/5 space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">深度智算模型 (MODEL)</label>
                        <select value={model} onChange={e=>setModel(e.target.value)} className="input !py-5 font-black hover:bg-zinc-900 transition-colors cursor-pointer">
                          {MODELS.map(m => <option key={m.id} value={m.id} className="bg-zinc-950">{m.name}</option>)}
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">API 端点路由 (ENDPOINT)</label>
                        <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} className="input !py-5" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">引擎访问令牌 (ACCESS TOKEN)</label>
                        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="• • • • • • • • • • • •" className="input !py-5 placeholder:text-zinc-900" />
                     </div>
                  </div>

                  <div className="card glass !p-10 border-[var(--color-primary)]/20">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] pl-1 mb-6 block">阶段性减脂达成目标 (TARGET KG)</label>
                    <div className="relative group">
                      <input type="number" step="0.1" value={goalWeight} onChange={(e) => setGoalWeight(e.target.value === "" ? "" : Number(e.target.value))} className="input !py-8 text-4xl font-black text-[var(--color-primary)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="70.0" />
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20"><Scale size={28} className="text-[var(--color-primary)]" /></div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button onClick={saveSettings} className="btn btn-primary flex-1 h-20 shadow-glow-strong !text-xs ring-4 ring-blue-500/10">保存引擎并激活数据连通</button>
                    <button onClick={() => setActiveTab("dashboard")} className="btn btn-secondary px-12 h-20 !text-xs">取消</button>
                  </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-40 text-center opacity-5 select-none pointer-events-none">
          <div className="w-16 h-1 bg-white mx-auto mb-10 rounded-full" />
          <p className="text-[10px] font-black uppercase tracking-[2em]">Standard Dashboard Ref • Build #006 PRO</p>
        </footer>
      </main>
    </div>
  );
}
