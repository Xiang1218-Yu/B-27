
import { User, StatItem } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '李明',
    email: 'liming@nova.design',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/alex/100/100',
    lastLogin: '2分钟前'
  },
  {
    id: '2',
    name: '张小丽',
    email: 'xiaoli.z@nova.design',
    role: 'Editor',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/sarah/100/100',
    lastLogin: '1小时前'
  },
  {
    id: '3',
    name: '王强',
    email: 'qiang.w@nova.design',
    role: 'Viewer',
    status: 'Inactive',
    avatar: 'https://picsum.photos/seed/marcus/100/100',
    lastLogin: '2天前'
  },
  {
    id: '4',
    name: '周芳',
    email: 'fang.z@nova.design',
    role: 'Editor',
    status: 'Pending',
    avatar: 'https://picsum.photos/seed/elena/100/100',
    lastLogin: '从未登录'
  },
  {
    id: '5',
    name: '陈建国',
    email: 'jianguo.c@nova.design',
    role: 'Admin',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/james/100/100',
    lastLogin: '5分钟前'
  }
];

export const mockStats: StatItem[] = [
  { label: '总营收', value: '¥824,592', trend: 12.5, icon: 'DollarSign' },
  { label: '活跃用户', value: '8,241', trend: 5.2, icon: 'Users' },
  { label: '转换率', value: '3.42%', trend: -2.1, icon: 'TrendingUp' },
  { label: '新增注册', value: '412', trend: 18.7, icon: 'UserPlus' }
];

export const chartData = [
  { name: '1月', value: 4000 },
  { name: '2月', value: 3000 },
  { name: '3月', value: 5000 },
  { name: '4月', value: 4500 },
  { name: '5月', value: 6000 },
  { name: '6月', value: 5500 },
  { name: '7月', value: 7000 },
];

// 专门为数据分析页面准备的数据
export const sourceData = [
  { name: '直接访问', value: 2400 },
  { name: '搜索引擎', value: 4567 },
  { name: '社交媒体', value: 1398 },
  { name: '外部链接', value: 9800 },
  { name: '邮件营销', value: 3908 },
];

export const deviceData = [
  { name: '移动端', value: 540 },
  { name: '桌面端', value: 320 },
  { name: '平板', value: 140 },
];

export const trafficHourlyData = [
  { time: '00:00', visitors: 120 },
  { time: '04:00', visitors: 45 },
  { time: '08:00', visitors: 850 },
  { time: '12:00', visitors: 1600 },
  { time: '16:00', visitors: 2100 },
  { time: '20:00', visitors: 1800 },
  { time: '23:59', visitors: 900 },
];

export const topPages = [
  { path: '/dashboard', views: '12,450', bounce: '24%', trend: '+12%' },
  { path: '/products/new', views: '8,200', bounce: '32%', trend: '+8%' },
  { path: '/blog/ai-future', views: '7,150', bounce: '18%', trend: '+45%' },
  { path: '/login', views: '5,300', bounce: '45%', trend: '-2%' },
  { path: '/settings/profile', views: '4,100', bounce: '12%', trend: '+5%' },
];
