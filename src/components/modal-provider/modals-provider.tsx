import type { FC, ReactElement, PropsWithChildren } from 'react';

import React, { useState, Fragment, useContext, useCallback, createContext } from 'react';

interface ModalEntry {
  id: number;
  element: ReactElement;
}

interface ModalsContextValue {
  showModal: (
    modalElement: ReactElement<{ open?: boolean; onClose?: (...args: any[]) => void }>
  ) => { closeModal: () => void };
}

const ModalsContext = createContext<ModalsContextValue | undefined>(undefined);

export const ModalsProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [modals, setModals] = useState<ModalEntry[]>([]);

  const removeModal = useCallback((id: number): void => {
    setModals((prev) => prev.filter((modal) => modal.id !== id));
  }, []);

  const showModal = useCallback(
    (
      modalElement: ReactElement<{ open?: boolean; onClose?: (...args: any[]) => void }>
    ): { closeModal: () => void } => {
      const id = Date.now() + Math.random();

      const closeModal = (): void => {
        removeModal(id);
      };

      const handleClose = (...args: any[]) => {
        if (modalElement.props.onClose) {
          modalElement.props.onClose(...args);
        }
        closeModal();
      };

      setModals((prev) => [...prev, { id, element: modalElement }]);

      return { closeModal: handleClose };
    },
    [removeModal]
  );

  return (
    <ModalsContext.Provider value={{ showModal }}>
      {children}
      {modals.map((modal) => (
        <Fragment key={modal.id}>{modal.element}</Fragment>
      ))}
    </ModalsContext.Provider>
  );
};

export const useModal = (): ModalsContextValue => {
  const context = useContext(ModalsContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalsProvider');
  }
  return context;
};
