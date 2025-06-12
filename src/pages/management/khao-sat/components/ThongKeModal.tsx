import React from 'react';
import { StatisticsModal } from './StatisticsModal';

interface ThongKeModalProps {
  open: boolean;
  onClose: () => void;
  activeTab: number;
  onTabChange: (tab: number) => void;
  loading: boolean;
  thongKeTongQuan: any;
  thongKeTheoDonVi: any[];
  thongKeTheoVungMien: any[];
  thongKeTheoCauHoi: any[];
  thongKeThoiGian: any[];
}

export const ThongKeModal: React.FC<ThongKeModalProps> = (props) => {
  return <StatisticsModal {...props} />;
};
