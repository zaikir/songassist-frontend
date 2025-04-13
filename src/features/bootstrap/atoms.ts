import type { User, Project } from 'src/types/entities';

import { atom } from 'jotai';

export const isAppInitializedAtom = atom(false);
export const userAtom = atom<User>();
export const projectsAtom = atom<Project[]>([]);
