import React from 'react';
import { SectionItem } from './SectionItem';
import { PhanKhaoSat, CauHoi } from '../types';

interface PhanKhaoSatItemProps {
  phan: PhanKhaoSat;
  index: number;
  totalSections: number;
  cauHoiList: CauHoi[];
  onEdit: () => void;
  onDelete: () => void;
  onAddQuestion: () => void;
  onEditQuestion: (cauHoi: CauHoi) => void;
  onDeleteQuestion: (cauHoiId: string, cauHoiTitle: string, maPhan: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onReloadAnswers: () => Promise<void>;
}

export const PhanKhaoSatItem: React.FC<PhanKhaoSatItemProps> = (props) => {
  return <SectionItem {...props} />;
};
