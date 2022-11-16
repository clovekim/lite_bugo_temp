import React, { Fragment, HTMLAttributes } from "react";

import { Dialog, Transition } from "@headlessui/react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  size?: string;
  noPadding?: boolean;
  position?: string;
}
/**
 * modal
 * @param open : open boolean
 * @param setOpen: setOpen
 * @param onClose: (option) 종료시 callback 함수
 * @param size: (option) 'tailwind css max-w 참조'
 * @param noPadding: (option) padding
 * @param position: (option) tailwind main css / items-center(center) items-start (top)
 * @returns
 */
export default function Modal({
  open,
  setOpen,
  children,
  onClose,
  size,
  noPadding,
  position,
}: Props) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-30 inset-0 overflow-y-auto"
        onClose={onClose ? onClose : setOpen}
      >
        <div
          className={`flex ${
            position ?? "items-end"
          } justify-center min-h-screen pt-4 ${
            noPadding ? "" : "px-4"
          } pb-20 text-center sm:block sm:p-0`}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`${
                size ?? "sm:max-w-lg"
              } inline-block align-bottom bg-white rounded-lg ${
                noPadding ? "p-0 sm:p-0" : "px-4 pt-5 pb-4 sm:p-6"
              } text-left  shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full `}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
