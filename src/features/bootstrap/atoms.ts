import type { Project } from 'src/types/entities';

import { atom } from 'jotai';

import type { User } from '../auth';

export const isAppInitializedAtom = atom(false);
export const userAtom = atom<User>();
export const projectsAtom = atom<Project[]>([]);
