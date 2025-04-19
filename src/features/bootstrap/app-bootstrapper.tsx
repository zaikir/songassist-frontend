import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAtomValue, getDefaultStore } from 'jotai';
import { loadIcons } from '@iconify/react/dist/iconify.js';

import { useMountEffect } from 'src/hooks/use-mount-effect';

import { api } from 'src/api';
import { getUserLocationInfo } from 'src/shared/utils/get-user-location-info';

import { useUser } from '../auth';
import { NewProjectDialog } from '../projects';
import { userAtom, chatsAtom, isAppInitializedAtom } from './atoms';

type Props = {
  children: React.ReactNode;
};

const store = getDefaultStore();

export function AppBootstrapper({ children }: Props) {
  const initialize = useCallback(async () => {
    loadIcons([
      'devicon:google',
      'solar:home-angle-bold-duotone',
      'solar:settings-bold-duotone',
      'eva:star-fill',
      'eva:refresh-fill',
      'mdi:like',
      'mdi:like-outline',
      'mdi:dislike',
      'mdi:dislike-outline',
      'mingcute:arrow-left-line',
    ]);

    await getUserLocationInfo();

    try {
      const result = await api.getAuthData();
      if (!result.user) {
        throw new Error('Forbidden');
      }

      store.set(userAtom, result.user);
      store.set(chatsAtom, result.chats);
      // store.set(projectsAtom, result.projects);
    } catch {
      // no-op
    } finally {
      store.set(isAppInitializedAtom, true);
    }
  }, []);

  useMountEffect(() => {
    initialize();
  });

  return (
    <>
      {children}
      <NewProjectDialogWrapper />
    </>
  );
}

function NewProjectDialogWrapper() {
  const user = useUser();
  const isInitialized = useAtomValue(isAppInitializedAtom);

  return (
    <AnimatePresence>
      {isInitialized && user && !user.language && <NewProjectDialog open onClose={() => {}} />}
    </AnimatePresence>
  );
}
