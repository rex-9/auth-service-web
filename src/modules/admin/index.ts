import { AnalyticsController, AnalyticsService } from "./analytics";
import { ChatController, ChatService } from "./chat";
import { NotificationController, NotificationService } from "./notification";
import { ProductController, ProductService } from "./product";
import { RoleController, RoleService } from "./role";
import UserController from "./user/user.controller";
import UserService from "./user/user.service";
import { FeedbackController, FeedbackService } from "./feedback";
import { LogController, LogService } from "./log";
import { AccessController, AccessService } from "./access";
import { AssetController, AssetService } from "./asset";

export * from "./analytics";
export * from "./chat";
export * from "./notification";
export * from "./product";
export * from "./access";
export * from "./feedback";
export * from "./log";
export * from "./role";
export * from "./user";
export * from "./asset";
export * from "./components";
export * from "./helpers/admin.helper";
export * from "./constants";

export const Admin = {
  AnalyticsController,
  AnalyticsService,
  ChatController,
  ChatService,
  NotificationController,
  NotificationService,
  ProductController,
  ProductService,
  RoleController,
  RoleService,
  UserController,
  UserService,
  AccessController,
  AccessService,
  FeedbackController,
  FeedbackService,
  LogController,
  LogService,
  AssetController,
  AssetService,
};
