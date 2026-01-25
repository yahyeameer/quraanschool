/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as academic from "../academic.js";
import type * as actions_notifications from "../actions/notifications.js";
import type * as admin from "../admin.js";
import type * as analytics from "../analytics.js";
import type * as assignments from "../assignments.js";
import type * as attendance from "../attendance.js";
import type * as billing from "../billing.js";
import type * as calendar from "../calendar.js";
import type * as classes from "../classes.js";
import type * as dailyProgress from "../dailyProgress.js";
import type * as expenses from "../expenses.js";
import type * as finance from "../finance.js";
import type * as gamification from "../gamification.js";
import type * as library from "../library.js";
import type * as livekit from "../livekit.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as parent from "../parent.js";
import type * as payments from "../payments.js";
import type * as permissions from "../permissions.js";
import type * as registrations from "../registrations.js";
import type * as reports from "../reports.js";
import type * as salaries from "../salaries.js";
import type * as schedule from "../schedule.js";
import type * as seed from "../seed.js";
import type * as students from "../students.js";
import type * as tasks from "../tasks.js";
import type * as teacher from "../teacher.js";
import type * as tracker from "../tracker.js";
import type * as transport from "../transport.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  academic: typeof academic;
  "actions/notifications": typeof actions_notifications;
  admin: typeof admin;
  analytics: typeof analytics;
  assignments: typeof assignments;
  attendance: typeof attendance;
  billing: typeof billing;
  calendar: typeof calendar;
  classes: typeof classes;
  dailyProgress: typeof dailyProgress;
  expenses: typeof expenses;
  finance: typeof finance;
  gamification: typeof gamification;
  library: typeof library;
  livekit: typeof livekit;
  messages: typeof messages;
  notifications: typeof notifications;
  parent: typeof parent;
  payments: typeof payments;
  permissions: typeof permissions;
  registrations: typeof registrations;
  reports: typeof reports;
  salaries: typeof salaries;
  schedule: typeof schedule;
  seed: typeof seed;
  students: typeof students;
  tasks: typeof tasks;
  teacher: typeof teacher;
  tracker: typeof tracker;
  transport: typeof transport;
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
