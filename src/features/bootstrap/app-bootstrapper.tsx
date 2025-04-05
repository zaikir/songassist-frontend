import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAtomValue, getDefaultStore } from 'jotai';

import { useMountEffect } from 'src/hooks/use-mount-effect';

import { api } from 'src/api';
import { getUserLocationInfo } from 'src/shared/utils/get-user-location-info';

import { useUser } from '../auth';
import { NewProjectDialog } from '../projects';
import { userAtom, projectsAtom, isAppInitializedAtom } from './atoms';

type Props = {
  children: React.ReactNode;
};

const store = getDefaultStore();

export function AppBootstrapper({ children }: Props) {
  const initialize = useCallback(async () => {
    await getUserLocationInfo();

    try {
      const result = await api.getAuthData();
      if (!result.user) {
        throw new Error('Forbidden');
      }

      store.set(userAtom, result.user);
      store.set(projectsAtom, result.projects);
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
  const projects = useAtomValue(projectsAtom);

  return (
    <AnimatePresence>
      {isInitialized && user && !projects.length && (
        <NewProjectDialog open onClose={() => {}} initial />
      )}
    </AnimatePresence>
  );
}
