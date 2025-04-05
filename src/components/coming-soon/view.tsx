import { Card } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ComingSoonIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function ComingSoonView() {
  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 2 }}>
        Coming soon!
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working hard on this page!
      </Typography>

      <ComingSoonIllustration sx={{ my: { xs: 5, sm: 10 } }} />
    </Card>
  );
}
