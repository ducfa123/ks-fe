import React from 'react';
import { 
  Accordion, AccordionSummary, AccordionDetails,
  Box, Typography, Chip, Button, TextField, FormControlLabel, Checkbox
} from "@mui/material";
import { ExpandMore, Delete, Edit } from "@mui/icons-material";
import { CauHoi } from "../types";
import { APIServices } from "../../../../utils";
import { useNotifier } from "../../../../provider/NotificationProvider";

interface QuestionItemProps {
  cauHoi: CauHoi;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onReloadAnswers: () => Promise<void>;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  cauHoi,
  index,
  onEdit,
  onDelete,
  onReloadAnswers
}) => {
  const { success, error } = useNotifier();

  const handleReloadAnswers = async () => {
    try {
      const dapAnResponse = await APIServices.DapAnService.getListByCauHoi(cauHoi._id);
      
      if (dapAnResponse && dapAnResponse.status === "Success" && 
          Array.isArray(dapAnResponse.data) && dapAnResponse.data.length > 0) {
        await onReloadAnswers();
        success("Đã tải đáp án thành công");
      } else {
        error("Không tìm thấy đáp án cho câu hỏi này");
      }
    } catch (err) {
      console.error("Lỗi khi tải đáp án:", err);
      error("Không thể tải đáp án");
    }
  };

  const renderQuestionPreview = () => {
    const loaiCauHoi = String(cauHoi.loai_cau_hoi).toLowerCase();
    
    if (loaiCauHoi === 'text') {
      return <TextField disabled fullWidth placeholder="Văn bản trả lời" size="small" />;
    }
    
    if (loaiCauHoi === 'rating') {
      return (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1,2,3,4,5].map(star => (
            <Box 
              key={star}
              sx={{ 
                width: 30, 
                height: 30, 
                border: '1px solid #ccc', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                cursor: 'not-allowed'
              }}
            >
              {star}
            </Box>
          ))}
        </Box>
      );
    }
    
    // Multiple choice or single choice
    if (cauHoi.dap_an && Array.isArray(cauHoi.dap_an) && cauHoi.dap_an.length > 0) {
      return (
        <Box>
          {cauHoi.dap_an.map((dapAn, optIndex) => (
            <Box key={optIndex} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <FormControlLabel
                control={
                  loaiCauHoi === 'single_choice' ? (
                    <input type="radio" disabled name={`question_${cauHoi._id}`} />
                  ) : (
                    <Checkbox disabled />
                  )
                }
                label={dapAn.gia_tri || ''}
              />
              <Chip 
                label={dapAn.loai_dap_an} 
                size="small" 
                sx={{ ml: 1, fontSize: '0.7rem' }} 
              />
            </Box>
          ))}
        </Box>
      );
    }
    
    // No answers available
    return (
      <Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Chưa có đáp án nào cho câu hỏi này
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleReloadAnswers}
        >
          Tải lại đáp án
        </Button>
      </Box>
    );
  };

  return (
    <Accordion 
      sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: '4px !important' }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMore />}
        sx={{ bgcolor: '#f5f5f5' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography fontWeight="medium">
            {index + 1}. {cauHoi.noi_dung}
            {cauHoi.bat_buoc && <Box component="span" sx={{ color: 'error.main', ml: 1 }}>*</Box>}
          </Typography>
          <Chip 
            label={cauHoi.loai_cau_hoi} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Box sx={{ mb: 2 }}>
          {renderQuestionPreview()}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />}
            onClick={onDelete}
            sx={{ mr: 1 }}
          >
            Xóa
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<Edit />}
            onClick={onEdit}
          >
            Sửa
          </Button>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
