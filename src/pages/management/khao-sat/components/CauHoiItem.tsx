import React from 'react';
import { QuestionItem } from './QuestionItem';
import { CauHoi } from '../types';

interface CauHoiItemProps {
  cauHoi: CauHoi;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onReloadAnswers: () => Promise<void>;
}

export const CauHoiItem: React.FC<CauHoiItemProps> = (props) => {
  return <QuestionItem {...props} />;
};
