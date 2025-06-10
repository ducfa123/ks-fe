import React from 'react';
import { Box, Typography, Button, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import { PhanKhaoSat, CauHoi } from "../types";
import { SectionItem } from './SectionItem';

interface SurveyContentTabProps {
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

export const SurveyContentTab: React.FC<SurveyContentTabProps> = ({
  danhSachPhan,
  danhSachCauHoi,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onMoveSection,
  onReloadAnswers
}) => {
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Nội dung khảo sát</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={onAddSection}
        >
          Thêm phần mới
        </Button>
      </Box>

      {danhSachPhan.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Chưa có phần nào trong khảo sát này</Typography>
          <Button 
            variant="outlined" 
            startIcon={<Add />} 
            sx={{ mt: 2 }}
            onClick={onAddSection}
          >
            Tạo phần đầu tiên
          </Button>
        </Paper>
      ) : (
        <Box>
          {danhSachPhan.map((phan, index) => (
            <SectionItem
              key={phan._id}
              phan={phan}
              index={index}
              totalSections={danhSachPhan.length}
              cauHoiList={danhSachCauHoi[phan._id] || []}
              onEdit={() => onEditSection(phan)}
              onDelete={() => onDeleteSection(phan._id, phan.tieu_de)}
              onAddQuestion={() => onAddQuestion(phan)}
              onEditQuestion={onEditQuestion}
              onDeleteQuestion={onDeleteQuestion}
              onMoveUp={() => onMoveSection(index, 'up')}
              onMoveDown={() => onMoveSection(index, 'down')}
              onReloadAnswers={() => onReloadAnswers(phan._id)}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
