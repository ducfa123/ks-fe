import React from 'react';
import { SurveyContentTab } from './SurveyContentTab';
import { PhanKhaoSat, CauHoi } from '../types';

interface NoiDungTabProps {
  danhSachPhan: PhanKhaoSat[];
  danhSachCauHoi: {[key: string]: CauHoi[]};
  onAddSection: () => void;
  onEditSection: (phan: PhanKhaoSat) => void;
  onDeleteSection: (phanId: string, phanTitle: string) => void;
  onAddQuestion: (phan: PhanKhaoSat) => void;
  onEditQuestion: (cauHoi: CauHoi) => void;
  onDeleteQuestion: (cauHoiId: string, cauHoiTitle: string, maPhan: string) => void;
  onMoveSection: (index: number, direction: 'up' | 'down') => void;
  onReloadAnswers: (maPhan: string) => Promise<void>;
}

export const NoiDungTab: React.FC<NoiDungTabProps> = (props) => {
  return <SurveyContentTab {...props} />;
};
