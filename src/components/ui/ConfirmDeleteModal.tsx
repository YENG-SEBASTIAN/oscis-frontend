'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Trash2 } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this item?',
}: ConfirmDeleteModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="pointer-events-auto w-[90vw] max-w-sm bg-white border border-gray-200 rounded-lg p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="text-red-600 h-5 w-5" />
                <Dialog.Title className="text-base font-semibold text-gray-800">
                  {title}
                </Dialog.Title>
              </div>

              <Dialog.Description className="text-sm text-gray-600 mb-4">
                {description}
              </Dialog.Description>

              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 text-sm border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-4 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
