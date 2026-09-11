import { beforeEach, describe, expect, it, vi } from "vitest";
import PaymentController from "./payment.controller";
import PaymentService from "./payment.service";

vi.mock("./payment.service", () => ({
  default: {
    getTransactions: vi.fn(),
    getTransaction: vi.fn(),
    getSubscriptions: vi.fn(),
    getSubscription: vi.fn(),
  },
}));

const item = { id: "record-1", type: "record", attributes: { id: "record-1" } };
const listResponse = {
  data: {
    status: { success: true },
    data: [item],
    meta: {
      pagination: {
        page: 1,
        limit: 20,
        total_count: 1,
        total_pages: 1,
      },
    },
  },
};

describe("AdminPaymentController", () => {
  beforeEach(() => vi.clearAllMocks());

  it("parses the admin transaction collection", async () => {
    vi.mocked(PaymentService.getTransactions).mockResolvedValue(listResponse as never);
    const result = await PaymentController.getTransactions({ page: 1 });
    expect(result.success).toBe(true);
    expect(result.transactions).toEqual([{ id: "record-1" }]);
  });

  it("parses a transaction detail", async () => {
    vi.mocked(PaymentService.getTransaction).mockResolvedValue({ data: { status: { success: true }, data: item } } as never);
    const result = await PaymentController.getTransaction("record-1");
    expect(result.transaction).toEqual({ id: "record-1" });
  });

  it("parses the admin subscription collection", async () => {
    vi.mocked(PaymentService.getSubscriptions).mockResolvedValue(listResponse as never);
    const result = await PaymentController.getSubscriptions({ page: 1 });
    expect(result.success).toBe(true);
    expect(result.subscriptions).toEqual([{ id: "record-1" }]);
  });

  it("parses a subscription detail", async () => {
    vi.mocked(PaymentService.getSubscription).mockResolvedValue({ data: { status: { success: true }, data: item } } as never);
    const result = await PaymentController.getSubscription("record-1");
    expect(result.subscription).toEqual({ id: "record-1" });
  });
});
