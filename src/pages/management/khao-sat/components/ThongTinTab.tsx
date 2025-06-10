import React from 'react';
import { SurveyInfoTab } from './SurveyInfoTab';
import { KhaoSatUI } from '../types';

interface ThongTinTabProps {
  khaoSat: KhaoSatUI;
}

export const ThongTinTab: React.FC<ThongTinTabProps> = ({ khaoSat }) => {
  return <SurveyInfoTab khaoSat={khaoSat} />;
};
