import { initializeApp } from "firebase/app";
import {
  getAnalytics,
  isSupported,
  logEvent as logFirebaseEvent,
  setUserId as setFirebaseUserId,
  type Analytics,
} from "firebase/analytics";
import AppConfig from "../AppConfig";
import {
  ANALYTICS_EVENTS,
  ANALYTICS_PARAMS,
  ANALYTICS_PLATFORMS,
  type TAnalyticsEvent,
} from "../constants";

type TAnalyticsParams = Record<string, string | number | boolean>;

class AnalyticsService {
  private analyticsPromise: Promise<Analytics | null> | null = null;

  private getAnalytics(): Promise<Analytics | null> {
    if (this.analyticsPromise) return this.analyticsPromise;

    this.analyticsPromise = (async () => {
      const config = AppConfig.FIREBASE;
      if (
        !config.apiKey ||
        !config.projectId ||
        !config.appId ||
        !config.measurementId
      ) {
        return null;
      }

      if (!(await isSupported())) return null;

      return getAnalytics(initializeApp(config));
    })().catch((error: unknown) => {
      console.warn("Analytics initialization failed", error);
      return null;
    });

    return this.analyticsPromise;
  }

  async logEvent(
    event: TAnalyticsEvent,
    parameters: TAnalyticsParams = {},
  ): Promise<void> {
    const analytics = await this.getAnalytics();
    if (!analytics) return;

    const eventName: string = event;
    logFirebaseEvent(analytics, eventName, {
      [ANALYTICS_PARAMS.PLATFORM]: ANALYTICS_PLATFORMS.WEB,
      ...parameters,
    });
  }

  async setUserId(userId: string | null): Promise<void> {
    const analytics = await this.getAnalytics();
    if (analytics) setFirebaseUserId(analytics, userId);
  }

  logSignUp(method: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.SIGN_UP, {
      [ANALYTICS_PARAMS.METHOD]: method,
    });
  }

  logSignIn(method: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.SIGN_IN, {
      [ANALYTICS_PARAMS.METHOD]: method,
    });
  }

  logSignOut(): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.SIGN_OUT);
  }

  logBeginOnboarding(method: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.BEGIN_ONBOARDING, {
      [ANALYTICS_PARAMS.METHOD]: method,
    });
  }

  logCompleteOnboarding(method: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.COMPLETE_ONBOARDING, {
      [ANALYTICS_PARAMS.METHOD]: method,
    });
  }

  logViewPage(pagePath: string, pageTitle: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.VIEW_PAGE, {
      [ANALYTICS_PARAMS.PAGE_PATH]: pagePath,
      [ANALYTICS_PARAMS.PAGE_TITLE]: pageTitle,
    });
  }

  logViewProduct(productId: string, productName: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.VIEW_PRODUCT, {
      [ANALYTICS_PARAMS.PRODUCT_ID]: productId,
      [ANALYTICS_PARAMS.PRODUCT_NAME]: productName,
    });
  }

  logPurchaseProduct(parameters: {
    productId: string;
    productName: string;
    currency: string;
    unitAmount: number;
    purchaseId: string;
  }): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.PURCHASE_PRODUCT, {
      [ANALYTICS_PARAMS.PRODUCT_ID]: parameters.productId,
      [ANALYTICS_PARAMS.PRODUCT_NAME]: parameters.productName,
      [ANALYTICS_PARAMS.CURRENCY]: parameters.currency,
      [ANALYTICS_PARAMS.UNIT_AMOUNT]: parameters.unitAmount,
      [ANALYTICS_PARAMS.PURCHASE_ID]: parameters.purchaseId,
    });
  }

  logOpenNotification(notificationId: string): Promise<void> {
    return this.logEvent(ANALYTICS_EVENTS.OPEN_NOTIFICATION, {
      [ANALYTICS_PARAMS.NOTIFICATION_ID]: notificationId,
    });
  }
}

export default new AnalyticsService();
