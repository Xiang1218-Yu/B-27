
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  DashboardOutlined, 
  TeamOutlined, 
  BarChartOutlined, 
  SettingOutlined, 
  MenuOutlined, 
  CloseOutlined, 
  LogoutOutlined, 
  CheckCircleOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserAddOutlined, 
  LoadingOutlined, 
  UserOutlined, 
  SafetyCertificateOutlined, 
  CameraOutlined, 
  WarningOutlined, 
  DownloadOutlined, 
  ReloadOutlined,
  MoreOutlined,
  HistoryOutlined,
  ArrowRightOutlined,
  BellOutlined,
  ChromeOutlined,
  KeyOutlined,
  MobileOutlined
} from '@ant-design/icons';
import { AppView, User as UserType } from './types';
import { 
  mockUsers, 
  mockStats, 
  chartData as defaultChartData, 
  sourceData, 
  deviceData
} from './mockData';
import { 
  AreaChart, Area, 
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// --- 通用 UI 组件 ---

const Toast: React.FC<{ message: string; type?: 'success' | 'error'; onClose: () => void }> = ({ 
  message, 
  type = 'success', 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-slate-900' : 'bg-rose-600';
  const Icon = type === 'success' ? CheckCircleOutlined : WarningOutlined;

  return (
    <div className={`fixed top-6 right-6 z-[110] ${bgColor} text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in border border-white/10 ring-1 ring-black/5`}>
      <Icon className="text-white shrink-0" style={{ fontSize: '20px' }} />
      <span className="font-semibold text-sm sm:text-base tracking-wide whitespace-nowrap">{message}</span>
    </div>
  );
};

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
    <div className="w-full max-w-md animate-fade-in">
      {children}
    </div>
  </div>
);

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-2xl' }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className={`relative w-full ${maxWidth} bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh] ring-1 ring-black/5`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{title}</h3>
            <div className="h-1 w-8 bg-blue-600 rounded-full mt-1"></div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90"
          >
            <CloseOutlined style={{ fontSize: '18px' }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {children}
        </div>

        {footer && (
          <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex justify-end items-center gap-3 sticky bottom-0 z-10">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm"
            >
              取消
            </button>
            <div className="flex gap-3">
              {footer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 业务视图组件 ---

const DashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [isDataLoading, setIsDataLoading] = useState(false);

  const generateChartData = (range: string) => {
    switch (range) {
      case '7days':
        return [
          { name: '周一', value: 2400 }, { name: '周二', value: 1398 }, { name: '周三', value: 9800 },
          { name: '周四', value: 3908 }, { name: '周五', value: 4800 }, { name: '周六', value: 3800 }, { name: '周日', value: 4300 },
        ];
      case '30days':
        return Array.from({ length: 30 }, (_, i) => ({
          name: i % 5 === 0 ? `第${i+1}天` : '',
          value: Math.floor(Math.random() * 5000) + 2000,
        }));
      case 'year':
        return [
          { name: '1月', value: 4000 }, { name: '2月', value: 3000 }, { name: '3月', value: 5000 },
          { name: '4月', value: 4500 }, { name: '5月', value: 6000 }, { name: '6月', value: 5500 },
          { name: '7月', value: 7000 }, { name: '8月', value: 6800 }, { name: '9月', value: 8100 },
          { name: '10月', value: 7600 }, { name: '11月', value: 9200 }, { name: '12月', value: 10500 },
        ];
      default:
        return defaultChartData;
    }
  };

  const currentChartData = useMemo(() => generateChartData(timeRange), [timeRange]);

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsDataLoading(true);
    const newRange = e.target.value;
    setTimeout(() => {
      setTimeRange(newRange);
      setIsDataLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-10">
      {/* 统计指标卡片组 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mockStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <DashboardOutlined style={{ fontSize: '20px' }} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stat.trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}%
              </span>
            </div>
            <h3 className="text-slate-500 font-medium mb-1 text-sm">{stat.label}</h3>
            <p className="text-xl sm:text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* 业务增长图表 - 占据全宽 */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
        {isDataLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center animate-fade-in">
             <LoadingOutlined className="text-blue-600 animate-spin" style={{ fontSize: '32px' }} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">业务增长概览</h3>
            <p className="text-slate-500 text-sm">实时数据性能指标</p>
          </div>
          <select 
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-600 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none cursor-pointer w-full sm:w-auto"
          >
            <option value="7days">过去 7 天</option>
            <option value="30days">过去 30 天</option>
            <option value="year">今年</option>
          </select>
        </div>
        <div className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }} 
                cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                formatter={(value) => [`${value}`, '数值']}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const AnalyticsView: React.FC<{ onAction: (msg: string) => void }> = ({ onAction }) => {
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => { setIsExporting(false); onAction('报表导出成功'); }, 1500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => { setIsRefreshing(false); onAction('数据大盘已刷新'); }, 1000);
  };

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-xl sm:text-2xl font-bold text-slate-800">业务分析大盘</h2><p className="text-slate-500 text-sm">全方位洞察系统流量与行为趋势</p></div>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={isExporting} className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {isExporting ? <LoadingOutlined className="animate-spin" /> : <DownloadOutlined />} {isExporting ? '导出中...' : '导出报表'}
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing} className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
            {isRefreshing ? <LoadingOutlined className="animate-spin text-blue-400" /> : <ReloadOutlined />} {isRefreshing ? '同步中...' : '刷新数据'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">流量来源分布</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">访问设备占比</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={8} dataKey="value">
                  {deviceData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SettingsViewProps {
  onAction: (msg: string) => void;
  avatar: string;
  setAvatar: (url: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onAction, avatar, setAvatar }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notifs, setNotifs] = useState({ system: true, business: true, marketing: false });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); onAction('偏好设置已保存'); }, 800);
  };

  const handleToggle = (key: keyof typeof notifs, label: string) => {
    const newValue = !notifs[key];
    setNotifs(prev => ({ ...prev, [key]: newValue }));
    onAction(`已${newValue ? '开启' : '关闭'}${label}通知`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setAvatar(reader.result as string); onAction('头像更新成功'); };
      reader.readAsDataURL(file);
    }
  };

  const Toggle = ({ active, onChange }: { active: boolean; onChange: () => void }) => (
    <div onClick={(e) => { e.stopPropagation(); onChange(); }} className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${active ? 'right-1' : 'left-1'}`} />
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8 pb-10 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h2 className="text-xl sm:text-2xl font-bold text-slate-800">系统偏好设置</h2><p className="text-slate-500 text-sm">管理您的个人资料、账户安全性及消息通知</p></div>
        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
          {isSaving ? <LoadingOutlined className="animate-spin" /> : null} {isSaving ? '保存中...' : '应用更改'}
        </button>
      </div>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
        {[{ id: 'profile', label: '个人中心', icon: UserOutlined }, { id: 'notifications', label: '通知配置', icon: BellOutlined }, { id: 'security', label: '账户安全', icon: SafetyCertificateOutlined }].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <tab.icon style={{ fontSize: '18px' }} /> {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 min-h-[400px]">
        {activeTab === 'profile' && (
          <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-slate-50">
              <div className="relative group shrink-0" onClick={() => fileInputRef.current?.click()}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <img src={avatar} className="w-28 h-28 rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-xl cursor-pointer transition-transform group-hover:scale-95" alt="Avatar" />
                <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><CameraOutlined style={{ fontSize: '32px', color: 'white' }} /></div>
              </div>
              <div className="text-center sm:text-left">
                <h4 className="text-2xl font-black text-slate-800">李明 <span className="text-sm font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full ml-2">超级管理员</span></h4>
                <p className="text-slate-400 mt-2">最后登录于：10 分钟前 • 杭州，中国</p>
                <p className="text-xs text-blue-500 font-bold mt-1 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>更改头像照片</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">显示名称</label><input type="text" defaultValue="admin" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">注册邮箱</label><input type="email" defaultValue="admin@nova.design" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium" /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">联系电话</label><input type="text" defaultValue="+86 138-xxxx-8888" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm font-medium" /></div>
            </div>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex items-center justify-between"><h3 className="text-xl font-black text-slate-800">消息通知路由</h3><button onClick={() => onAction('已成功将所有通知标记为已读')} className="text-sm font-bold text-blue-600 hover:text-blue-700">全部标为已读</button></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { id: 'system', title: '关键系统警报', desc: '当服务器负载过高或出现异常访问时实时推送', icon: WarningOutlined, color: 'text-rose-600 bg-rose-50' },
                 { id: 'business', title: '每周业务简报', desc: '每周一早晨 8:00 发送上周业务数据统计摘要', icon: BarChartOutlined, color: 'text-blue-600 bg-blue-50' },
                 { id: 'marketing', title: '产品更新动态', desc: '接收 NovaAdmin 的新功能发布和系统维护预告', icon: ChromeOutlined, color: 'text-indigo-600 bg-indigo-50' },
                 { id: 'security', title: '登录安全提醒', desc: '在新设备或非常规地点登录时发送邮件验证码', icon: SafetyCertificateOutlined, color: 'text-emerald-600 bg-emerald-50' }
               ].map(item => (
                 <div key={item.id} className="flex items-start justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all gap-4 group">
                    <div className="flex items-start gap-5 min-w-0">
                      <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${item.color}`}><item.icon style={{ fontSize: '24px' }} /></div>
                      <div className="min-w-0"><p className="font-bold text-slate-800 text-lg">{item.title}</p><p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p></div>
                    </div>
                    <div className="pt-1"><Toggle active={notifs[item.id as keyof typeof notifs]} onChange={() => handleToggle(item.id as keyof typeof notifs, item.title)} /></div>
                 </div>
               ))}
             </div>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="space-y-10 animate-fade-in">
             <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-white/20 backdrop-blur-md rounded-3xl"><SafetyCertificateOutlined style={{ fontSize: '42px' }} /></div>
                  <div><p className="font-black text-2xl">双重验证保护 (2FA)</p><p className="text-blue-100 mt-2 max-w-md">为您的管理员账户提供银行级别的安全保护。</p></div>
                </div>
                <button onClick={() => onAction('安全设置已启用')} className="px-10 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap">立即提升安全性</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                   <div className="flex items-center gap-3"><KeyOutlined style={{ fontSize: '24px' }} className="text-slate-400" /><h3 className="text-xl font-black text-slate-800">修改登录密码</h3></div>
                   <div className="space-y-4">
                      <input type="password" placeholder="当前密码" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm" />
                      <input type="password" placeholder="新密码" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all text-sm" />
                      <button onClick={() => onAction('密码已重置')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 shadow-xl transition-all">更新账户密码</button>
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="flex items-center gap-3"><MobileOutlined style={{ fontSize: '24px' }} className="text-slate-400" /><h3 className="text-xl font-black text-slate-800">最近登录日志</h3></div>
                   <div className="space-y-4">
                      {[{ time: '今天 10:24', device: 'Chrome / Win11' }, { time: '昨天 09:15', device: 'Safari / iOS' }].map((log, idx) => (
                        <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div><p className="font-bold text-slate-800 text-sm">{log.device}</p><p className="text-xs text-slate-500 mt-1">{log.time}</p></div>
                          {idx === 0 && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">当前</span>}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 用户管理视图 ---

const UserManagementView: React.FC<{ 
  onAction: (msg: string) => void; 
  onAddUser: () => void; 
  onDeleteUser: (user: UserType) => void; 
  onEditUser: (user: UserType) => void; 
  users: UserType[] 
}> = ({ onAction, onAddUser, onDeleteUser, onEditUser, users }) => (
  <div className="animate-fade-in space-y-6 pb-10">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">团队管理</h2>
        <p className="text-slate-500 text-sm">配置成员角色与组织结构</p>
      </div>
      <button onClick={onAddUser} className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <UserAddOutlined style={{ fontSize: '20px' }} /> 添加成员
      </button>
    </div>

    {/* PC 端表格视图 */}
    <div className="hidden sm:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden overflow-x-auto no-scrollbar">
      <table className="w-full text-left min-w-[700px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">成员</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">角色</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase">状态</th>
            <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map(user => (
            <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-4">
                <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-white shrink-0" alt={user.name} />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{user.role}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>{user.status}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEditUser(user)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><EditOutlined /></button>
                  <button onClick={() => onDeleteUser(user)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><DeleteOutlined /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* 移动端卡片视图 */}
    <div className="sm:hidden grid grid-cols-1 gap-4">
      {users.map(user => (
        <div key={user.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={user.avatar} className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm shrink-0" alt={user.name} />
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-base truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 bg-slate-50 rounded-lg">
              <MoreOutlined />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">系统角色</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-sm font-bold text-slate-600">{user.role}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">当前状态</p>
              <span className={`text-xs font-black px-2 py-0.5 rounded-md ${user.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                {user.status === 'Active' ? '在线' : user.status === 'Inactive' ? '离线' : '审核中'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              onClick={() => onEditUser(user)} 
              className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
            >
              <EditOutlined /> 编辑资料
            </button>
            <button 
              onClick={() => onDeleteUser(user)} 
              className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
            >
              <DeleteOutlined /> 移除成员
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- 主布局组件 ---

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeView, setActiveView] = useState<AppView>(AppView.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [adminAvatar, setAdminAvatar] = useState('https://picsum.photos/seed/admin/100/100');
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  
  const [dialogConfig, setDialogConfig] = useState<{ isOpen: boolean; title: string; children: React.ReactNode; footer?: React.ReactNode; maxWidth?: string }>({
    isOpen: false, title: '', children: null
  });

  const closeDialog = () => setDialogConfig(prev => ({ ...prev, isOpen: false }));
  const openDialog = (config: Omit<typeof dialogConfig, 'isOpen'>) => setDialogConfig({ ...config, isOpen: true });

  const handleAction = (msg: string, type: 'success' | 'error' = 'success') => setToast({ msg, type });

  const handleNavigate = (view: AppView) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const onAddUser = () => {
    let newUser: Partial<UserType> = { role: 'Viewer', status: 'Pending' };
    openDialog({
      title: '新增团队成员',
      children: (
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">姓名</label>
            <input type="text" placeholder="成员姓名" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" onChange={e => newUser.name = e.target.value} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">邮箱</label>
            <input type="email" placeholder="成员邮箱" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" onChange={e => newUser.email = e.target.value} />
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl text-xs text-amber-700 font-bold border border-amber-100">默认密码将发送至上述邮箱。</div>
        </div>
      ),
      footer: <button onClick={() => { 
        if(newUser.name) { 
          const fullUser = { ...newUser, id: Math.random().toString(), avatar: `https://picsum.photos/seed/${newUser.name}/100/100`, status: 'Active', role: newUser.role || 'Viewer' } as UserType;
          setUsers([fullUser, ...users]); handleAction('新成员已成功加入团队'); closeDialog();
        }
      }} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold">确认添加</button>
    });
  };

  const onEditUser = (user: UserType) => {
    let editedUser = { ...user };
    openDialog({
      title: '编辑成员资料',
      children: (
        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <img src={user.avatar} className="w-16 h-16 rounded-2xl border-2 border-slate-50 shadow-sm" alt={user.name} />
            <div>
              <p className="font-black text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">修改姓名</label>
            <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" onChange={e => editedUser.name = e.target.value} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-1">系统角色</label>
            <select 
              defaultValue={user.role} 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-600"
              onChange={e => editedUser.role = e.target.value as any}
            >
              <option value="Admin">管理员 (Admin)</option>
              <option value="Editor">编辑者 (Editor)</option>
              <option value="Viewer">查看者 (Viewer)</option>
            </select>
          </div>
        </div>
      ),
      footer: <button onClick={() => { 
        setUsers(users.map(u => u.id === user.id ? editedUser : u));
        handleAction('资料更新成功'); closeDialog();
      }} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold">保存更改</button>
    });
  };

  const onDeleteUser = (user: UserType) => {
    openDialog({
      title: '确认移除成员',
      maxWidth: 'max-w-md',
      children: (
        <div className="py-6 flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center">
            <WarningOutlined style={{ fontSize: '40px' }} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-slate-800">您确定要执行此操作吗？</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              成员 <span className="font-bold text-slate-900">{user.name}</span> 将会从团队中移除，此操作无法撤销。
            </p>
          </div>
        </div>
      ),
      footer: (
        <button 
          onClick={() => { 
            setUsers(users.filter(u => u.id !== user.id));
            handleAction('成员已成功移除', 'success'); closeDialog();
          }} 
          className="px-8 py-2.5 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200"
        >
          确定移除
        </button>
      )
    });
  };

  if (!isAuthenticated) return (
    <AuthLayout>
      {authView === 'login' ? (
        <LoginView onLogin={(a, p) => { if(a==='admin' && p==='admin123'){setIsAuthenticated(true); handleAction('欢迎回来'); return true;} return false; }} onSwitch={() => setAuthView('register')} onError={m => handleAction(m, 'error')} />
      ) : (
        <RegisterView onRegister={(e, p) => { setIsAuthenticated(true); handleAction('注册成功'); }} onSwitch={() => setAuthView('login')} />
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </AuthLayout>
  );

  return (
    <div className="h-screen flex bg-[#f8fafc] overflow-hidden text-slate-800">
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[45] transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsSidebarOpen(false)}
      />

      <aside className={`fixed lg:relative top-0 bottom-0 z-50 transition-all duration-300 bg-white border-r border-slate-100 flex-shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:w-20 lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 gap-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg text-white font-black text-xl">N</div>
            {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-slate-800">NovaAdmin</span>}
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {[
              { id: AppView.DASHBOARD, label: '系统概览', icon: DashboardOutlined },
              { id: AppView.USERS, label: '团队管理', icon: TeamOutlined },
              { id: AppView.ANALYTICS, label: '数据大盘', icon: BarChartOutlined },
              { id: AppView.SETTINGS, label: '偏好设置', icon: SettingOutlined },
            ].map(item => (
              <button key={item.id} onClick={() => handleNavigate(item.id)} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${activeView === item.id ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50'}`}>
                <item.icon style={{ fontSize: '22px' }} />
                {isSidebarOpen && <span className="font-semibold text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-50"><button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-colors"><LogoutOutlined style={{ fontSize: '22px' }} /> {isSidebarOpen && <span className="font-semibold text-sm">退出登录</span>}</button></div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 shrink-0 z-40 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"><MenuOutlined style={{ fontSize: '20px' }} /></button>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <div className="text-right hidden sm:block"><p className="text-sm font-bold text-slate-800 leading-tight">管理员</p><p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">PRO EDITION</p></div>
             <img src={adminAvatar} className="w-10 h-10 rounded-xl border-2 border-white shadow-sm ring-2 ring-slate-50 shrink-0 object-cover" alt="Admin" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/30">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            {activeView === AppView.DASHBOARD && <DashboardView />}
            {activeView === AppView.USERS && (
              <UserManagementView 
                users={users} 
                onAction={handleAction} 
                onAddUser={onAddUser} 
                onDeleteUser={onDeleteUser} 
                onEditUser={onEditUser} 
              />
            )}
            {activeView === AppView.SETTINGS && <SettingsView onAction={handleAction} avatar={adminAvatar} setAvatar={setAdminAvatar} />}
            {activeView === AppView.ANALYTICS && <AnalyticsView onAction={handleAction} />}
          </div>
        </div>
      </main>

      <Dialog 
        isOpen={dialogConfig.isOpen} 
        onClose={closeDialog} 
        title={dialogConfig.title} 
        footer={dialogConfig.footer} 
        maxWidth={dialogConfig.maxWidth}
      >
        {dialogConfig.children}
      </Dialog>
      
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// --- 登录/注册辅助视图 ---
const LoginView: React.FC<{ onLogin: (a:string,p:string)=>boolean; onSwitch:()=>void; onError:(m:string)=>void }> = ({ onLogin, onSwitch, onError }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-10 space-y-8">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl text-white font-black text-3xl">N</div>
      <h2 className="text-2xl font-bold">后台管理登录</h2>
    </div>
    <div className="space-y-4">
      <input id="acc" type="text" defaultValue="admin" placeholder="账号" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
      <input id="pass" type="password" defaultValue="admin123" placeholder="密码" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
      <button onClick={() => {
        const a = (document.getElementById('acc') as HTMLInputElement).value;
        const p = (document.getElementById('pass') as HTMLInputElement).value;
        if(!onLogin(a,p)) onError('账号或密码错误');
      }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-slate-800 transition-all">立即登录</button>
    </div>
    <p className="text-center text-sm text-slate-500">没有账号? <button onClick={onSwitch} className="text-blue-600 font-bold">点击注册</button></p>
  </div>
);

const RegisterView: React.FC<{ onRegister: (e:string,p:string)=>void; onSwitch:()=>void }> = ({ onRegister, onSwitch }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] shadow-2xl p-10 space-y-8">
    <h2 className="text-2xl font-bold text-center">注册新账户</h2>
    <div className="space-y-4">
      <input type="text" placeholder="全名" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
      <input type="email" placeholder="邮箱" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
      <input type="password" placeholder="密码" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-500/10 transition-all" />
      <button onClick={() => onRegister('','')} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl hover:bg-blue-700 transition-all">创建账户</button>
    </div>
    <button onClick={onSwitch} className="w-full text-center text-sm text-blue-600 font-bold">返回登录</button>
  </div>
);

export default App;
