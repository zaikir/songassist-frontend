import type { LoadingButtonProps } from '@mui/lab/LoadingButton';

import { useState } from 'react';

import MuiLoadingButton from '@mui/lab/LoadingButton';

type Props = Omit<LoadingButtonProps, 'onClick'> & {
  onClick?: () => Promise<unknown> | unknown;
};

export function LoadingButton({ ...props }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await props.onClick?.();
    setIsLoading(false);
  };

  return <MuiLoadingButton {...props} loading={props.loading ?? isLoading} onClick={handleClick} />;
}
