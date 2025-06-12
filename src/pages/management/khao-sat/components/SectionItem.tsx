import React from 'react';
import { 
  Paper, Box, Typography, IconButton, Button,
  Accordion, AccordionSummary, AccordionDetails, Chip
} from "@mui/material";
import { 
  Edit, Delete, KeyboardArrowUp, KeyboardArrowDown, 
  Add, ExpandMore 
} from "@mui/icons-material";
import { PhanKhaoSat, CauHoi } from "../types";
import { QuestionItem } from './QuestionItem';
interface SectionItemProps {
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

export const SectionItem: React.FC<SectionItemProps> = ({
  phan,
  index,
  totalSections,
  cauHoiList,
  onEdit,
  onDelete,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
  onMoveUp,
  onMoveDown,
  onReloadAnswers
}) => {
  return (
    <Paper 
      sx={{ mb: 3, overflow: 'hidden', borderRadius: 2 }}
    >
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'primary.light', 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ mr: 2 }}>
            <IconButton 
              size="small" 
              disabled={index === 0}
              onClick={onMoveUp}
            >
              <KeyboardArrowUp sx={{ color: index === 0 ? 'rgba(255,255,255,0.5)' : 'white' }} />
            </IconButton>
            <IconButton 
              size="small" 
              disabled={index === totalSections - 1}
              onClick={onMoveDown}
            >
              <KeyboardArrowDown sx={{ color: index === totalSections - 1 ? 'rgba(255,255,255,0.5)' : 'white' }} />
            </IconButton>
          </Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Phần {index + 1}: {phan.tieu_de}
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={onEdit}>
            <Edit sx={{ color: 'white' }} />
          </IconButton>
          <IconButton size="small" onClick={onDelete}>
            <Delete sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      </Box>

      {phan.mo_ta && (
        <Box sx={{ px: 3, py: 2, bgcolor: 'primary.light', opacity: 0.8, color: 'white' }}>
          <Typography variant="body2">{phan.mo_ta}</Typography>
        </Box>
      )}

      <Box sx={{ p: 3 }}>
        <Box>
          {cauHoiList.length > 0 ? (
            cauHoiList.map((cauHoi, qIndex) => (
              <QuestionItem
                key={cauHoi._id}
                cauHoi={cauHoi}
                index={qIndex}
                onEdit={() => onEditQuestion(cauHoi)}
                onDelete={() => onDeleteQuestion(cauHoi._id, cauHoi.noi_dung, phan._id)}
                onReloadAnswers={onReloadAnswers}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
              Chưa có câu hỏi nào trong phần này
            </Typography>
          )}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={onAddQuestion}
          fullWidth
          sx={{ mt: 2 }}
        >
          Thêm câu hỏi
        </Button>
      </Box>
    </Paper>
  );
};
