/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as assignments from "../assignments.js";
import type * as attendance from "../attendance.js";
import type * as classes from "../classes.js";
import type * as dailyProgress from "../dailyProgress.js";
import type * as notifications from "../notifications.js";
import type * as parent from "../parent.js";
import type * as payments from "../payments.js";
import type * as permissions from "../permissions.js";
import type * as registrations from "../registrations.js";
import type * as schedule from "../schedule.js";
import type * as tasks from "../tasks.js";
import type * as teacher from "../teacher.js";
import type * as tracker from "../tracker.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  assignments: typeof assignments;
  attendance: typeof attendance;
  classes: typeof classes;
  dailyProgress: typeof dailyProgress;
  notifications: typeof notifications;
  parent: typeof parent;
  payments: typeof payments;
  permissions: typeof permissions;
  registrations: typeof registrations;
  schedule: typeof schedule;
  tasks: typeof tasks;
  teacher: typeof teacher;
  tracker: typeof tracker;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
