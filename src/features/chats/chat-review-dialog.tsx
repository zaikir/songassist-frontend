import React, { useState } from 'react';

import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Box,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export function ReviewDialog({ open, onClose, onSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    setRating(newValue);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(rating || 0, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Leave a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1">Your Rating:</Typography>
            <Rating
              name="review-rating"
              value={rating}
              onChange={handleRatingChange}
              emptyIcon={<StarBorderIcon fontSize="inherit" />}
            />
          </Box>
          <TextField
            label="Your Comment"
            multiline
            minRows={4}
            fullWidth
            value={comment}
            onChange={handleCommentChange}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!rating}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
