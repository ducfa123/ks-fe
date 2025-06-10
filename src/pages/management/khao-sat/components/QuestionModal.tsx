import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  FormControlLabel, Checkbox, Box, Typography, Divider, IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { LoaiCauHoi, LoaiDapAn, DapAn } from "../types";

interface QuestionModalProps {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  formData: {
    noi_dung: string;
    loai_cau_hoi: LoaiCauHoi;
    bat_buoc: boolean;
  };
  onFormChange: (formData: any) => void;
  tempAnswers: DapAn[];
  onTempAnswersChange: (answers: DapAn[]) => void;
  answerForm: {
    gia_tri: string;
    loai_dap_an: LoaiDapAn;
  };
  onAnswerFormChange: (form: any) => void;
  onSubmit: () => void;
}

export const QuestionModal: React.FC<QuestionModalProps> = ({
  open,
  onClose,
  isEdit,
  formData,
  onFormChange,
  tempAnswers,
  onTempAnswersChange,
  answerForm,
  onAnswerFormChange,
  onSubmit
}) => {
  const isQuestionTypeNeedAnswers = (type: string) => {
    return type === LoaiCauHoi.SINGLE_CHOICE || 
           type === LoaiCauHoi.MULTIPLE_CHOICE || 
           type === LoaiCauHoi.LIKERT_SCALE;
  };

  const handleAddTempAnswer = () => {
    if (!answerForm.gia_tri) return;
    
    onTempAnswersChange([...tempAnswers, { 
      ...answerForm,
      noi_dung: answerForm.gia_tri 
    }]);
    onAnswerFormChange({
      gia_tri: '',
      loai_dap_an: LoaiDapAn.TEXT
    });
  };

  const handleDeleteTempAnswer = (index: number) => {
    const newAnswers = [...tempAnswers];
    newAnswers.splice(index, 1);
    onTempAnswersChange(newAnswers);
  };

  const renderTempAnswers = () => {
    if (tempAnswers.length === 0) {
      return (
        <Box sx={{ py: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="body2">Chưa có đáp án nào</Typography>
        </Box>
      );
    }

    return tempAnswers.map((dapAn, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center', my: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">
            {index + 1}. {dapAn.gia_tri}
          </Typography>
        </Box>
        <IconButton 
          size="small"
          onClick={() => handleDeleteTempAnswer(index)}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEdit ? "Sửa câu hỏi" : "Thêm câu hỏi"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nội dung câu hỏi"
          fullWidth
          value={formData.noi_dung}
          onChange={(e) => onFormChange({...formData, noi_dung: e.target.value})}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Loại câu hỏi</InputLabel>
          <Select
            value={formData.loai_cau_hoi}
            label="Loại câu hỏi"
            onChange={(e) => onFormChange({
              ...formData,
              loai_cau_hoi: e.target.value as any
            })}
          >
            {Object.values(LoaiCauHoi).map(loai => (
              <MenuItem key={loai} value={loai}>{loai}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.bat_buoc}
              onChange={(e) => onFormChange({...formData, bat_buoc: e.target.checked})}
            />
          }
          label="Câu hỏi bắt buộc"
          sx={{ mt: 1 }}
        />
        
        {isQuestionTypeNeedAnswers(formData.loai_cau_hoi) && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1">Các đáp án</Typography>
            <Divider sx={{ mb: 2, mt: 0.5 }} />
            
            <Box sx={{ mb: 2 }}>
              {renderTempAnswers()}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <TextField
                label="Nội dung đáp án"
                value={answerForm.gia_tri}
                onChange={(e) => onAnswerFormChange({...answerForm, gia_tri: e.target.value})}
                sx={{ flexGrow: 1, mr: 1 }}
              />
              <FormControl sx={{ width: 150, mr: 1 }}>
                <InputLabel>Loại đáp án</InputLabel>
                <Select
                  value={answerForm.loai_dap_an}
                  label="Loại đáp án"
                  onChange={(e) => onAnswerFormChange({...answerForm, loai_dap_an: e.target.value as any})}
                >
                  {Object.values(LoaiDapAn).map(loai => (
                    <MenuItem key={loai} value={loai}>{loai}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={handleAddTempAnswer}
                disabled={!answerForm.gia_tri}
              >
                Thêm
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button 
          variant="contained"
          disabled={!formData.noi_dung || (isQuestionTypeNeedAnswers(formData.loai_cau_hoi) && tempAnswers.length === 0)}
          onClick={onSubmit}
        >
          {isEdit ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
