import type { ButtonBaseProps } from '@mui/material';

import { useState } from 'react';
import { usePopover } from 'minimal-shared/hooks';
import { useMatch, useRouter, useNavigate } from '@tanstack/react-router';

import { Stack, useTheme, MenuList, MenuItem, ButtonBase, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { useProjects } from '../hooks/use-projects';
import { NewProjectDialog } from './new-project-dialog';
import { useSelectedProject } from '../hooks/use-selected-project';

export type ProjectSelectorProps = ButtonBaseProps;

export function ProjectSelector({ ...props }: ProjectSelectorProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const projects = useProjects();
  const project = useSelectedProject();
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const { open, anchorEl, onClose, onOpen } = usePopover();
  const routeMatch = useMatch({ strict: false });
  const router = useRouter();

  const renderProject = (
    item: (typeof projects)[0] | null,
    icon: JSX.Element | null,
    style?: 'light' | 'dark'
  ) => (
    <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
      {/* <Avatar
        src={item?.avatarUrl}
        sx={{ width: '24px', height: '24px', mr: 1.5, bgcolor: 'transparent' }}
      >
        .
      </Avatar> */}
      <Stack direction="column" sx={{ overflow: 'hidden', flex: 1, pr: 0.2 }}>
        {/* <Typography
          noWrap
          variant="caption"
          sx={{
            lineHeight: 1.5,
            color: style === 'light' ? theme.palette.text.secondary : theme.palette.grey[500],
          }}
        >
          {item?.bundleId ?? 'bundle_id'}
        </Typography> */}
        <Typography
          noWrap
          sx={{
            mt: -0.3,
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 600,
            color: style === 'light' ? theme.palette.text.primary : 'rgb(254, 214, 128)',
          }}
        >
          {item?.name ?? '.'}
        </Typography>
      </Stack>
      {icon}
    </Stack>
  );

  const renderButton = () => (
    <ButtonBase
      {...props}
      onClick={onOpen}
      sx={[
        {
          display: 'block',
          py: 1.25,
          pl: 1.5,
          pr: 1,
          borderRadius: 1,
          textAlign: 'start',
          cursor: 'pointer',
          background: 'white',
          '&:hover': {
            background: theme.palette.grey[300],
          },
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      <Stack direction="row" alignItems="center" sx={{ flex: 1 }}>
        {/* <Avatar
          src={project?.avatarUrl}
          sx={{ width: '24px', height: '24px', mr: 1.5, bgcolor: 'transparent' }}
        >
          <Iconify icon="solar:notes-bold" color="black" opacity={0.25} />
        </Avatar> */}
        <Typography
          noWrap
          sx={{
            flex: 1,
            fontSize: '1rem',
            lineHeight: 1.5,
            fontWeight: project ? 600 : 400,
            color: 'black',
            opacity: project ? 1 : 0.5,
            mr: 1,
          }}
        >
          {project?.name ?? 'Not selected'}
        </Typography>
        <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
      </Stack>
    </ButtonBase>
  );

  const renderMenuList = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{
        arrow: { placement: 'top-left', hide: true },
        paper: { sx: { mt: 0.5, ml: 0, boxShadow: 0, borderWidth: 0, bgcolor: 'white' } },
      }}
    >
      <MenuList sx={{ width: 200, borderWidth: 0 }}>
        {projects.map((option) => (
          <MenuItem
            key={option.id}
            selected={false}
            onClick={() => {
              router.navigate({
                params: {
                  project: option.id,
                },
              } as any);

              onClose();
            }}
            sx={{
              height: 40,
              ...(option.id === project?.id && { background: theme.palette.primary.lighter }),
            }}
          >
            {renderProject(option, null, 'light')}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            onClose();
            setIsNewProjectDialogOpen(true);
          }}
          sx={{ height: 40 }}
        >
          <Iconify width={24} icon="carbon:add-large" />
          <Typography sx={{ ml: '-4px', fontWeight: '600', fontSize: '0.875rem', lineHeight: 1.5 }}>
            Create Project
          </Typography>
        </MenuItem>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      {renderButton()}
      {renderMenuList()}
      <NewProjectDialog
        open={isNewProjectDialogOpen}
        onClose={() => setIsNewProjectDialogOpen(false)}
        initial={false}
      />
    </>
  );
}
