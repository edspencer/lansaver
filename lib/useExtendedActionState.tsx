import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

/**
 * Custom hook that extends the functionality of useFormState hook from "react-dom".
 * It wraps a server action to handle common tasks like showing a toast message and redirecting.
 *
 * @param action - The server action to wrap.
 * @param initialState - The initial state for the form.
 * @param otherArgs - Additional arguments to be passed to the server action (optional)
 * @returns An array containing the state and form action.
 *
 *  * @example
 * ```tsx
 * import { useExtendedActionState } from "@/lib/useExtendedActionState";
 * import { updateDeviceAction } from "@/app/actions/devices";
 *
 * export function EditForm({ device }: { device: Device }) {
 *   const [, formAction] = useExtendedActionState(updateDeviceAction), {});
 *
 *   return <DeviceForm device={device} formAction={formAction} />;
 * }
 *
 * // in app/actions/devices.ts:
 * import type { GenericServerAction } from "@/lib/actions";
 * export async function updateDeviceAction(prevState: any, formData: FormData): Promise<GenericServerAction> {
 *    //do whatever
 *    return { success: true, message: "Device updated", redirect: `/devices/${id}` };
 * }
 */
export function useExtendedActionState(action: Function, initialState: any, ...otherArgs: any[]) {
  const router = useRouter();
  const wrappedAction = wrapServerAction(action, router, ...otherArgs);
  const [state, formAction] = useFormState(wrappedAction, initialState);

  return [state, formAction];
}

/**
 * Custom hook that wraps a generic action function and handles the response.
 * @param action The generic action function to be executed.
 * @param args The arguments to be passed to the action function.
 * @returns A function that, when called, executes the action function and handles the response.
 */
export function useGenericAction(action: Function, ...args: any[]) {
  const router = useRouter();

  return async () => {
    const result = await action(...(args || []));
    processGenericResponse(result, router);

    return result;
  };
}

/**
 * Represents a generic server action.
 */
export type GenericServerAction = {
  success: boolean;
  message?: string;
  redirect?: string;
  error?: string;
  validationError?: any;
  payload?: any;
};

/**
 * Wrap a server action to handle common tasks like showing a toast message and redirecting.
 * It's better to use the useExtendedActionState hook instead of this function.
 *
 * @param action - The actual server action to wrap.
 * @param router - The router object to use for redirection.
 * @param otherArgs - Additional arguments to be passed to the server action.
 * @returns A function that wraps the server action.
 *
 * @example
 * ```tsx
 * import { wrapServerAction } from "@/lib/actions";
 * import { updateDeviceAction } from "@/app/actions/devices";
 * import { useRouter } from "next/navigation";
 *
 * export function EditForm({ device }: { device: Device }) {
 *   const router = useRouter();
 *   const [, formAction] = useFormState(wrapServerAction(updateDeviceAction, router), {});
 *
 *   return <DeviceForm device={device} formAction={formAction} />;
 * }
 *
 * // in app/actions/devices.ts:
 * import type { GenericServerAction } from "@/lib/actions";
 * export async function updateDeviceAction(prevState: any, formData: FormData): Promise<GenericServerAction> {
 *    //do whatever
 *    return { success: true, message: "Device updated", redirect: `/devices/${id}` };
 * }
 */
export function wrapServerAction(action: Function, router: any, ...otherArgs: any[]) {
  return async (...args: any[]) => {
    const result = await action(...(otherArgs || []), ...args);
    processGenericResponse(result, router);

    return result;
  };
}

/**
 * Processes a generic server response and performs actions based on the result.
 *
 * @param result - The generic server action result.
 * @param router - The router object for navigation.
 */
export function processGenericResponse(result: GenericServerAction, router: any) {
  if (result.message) {
    if (result.success) {
      toast(result.message);
    } else {
      toast.error(result.message);
    }
  }

  if (result.error) {
    console.error(result.error);
  }

  if (result.redirect) {
    router.push(result.redirect);
  }
}
