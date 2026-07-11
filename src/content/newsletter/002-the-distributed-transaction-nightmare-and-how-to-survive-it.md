---
title: "The Distributed Transaction Nightmare (And How to Survive It)"
date: "2026-07-12"
issue: "#002"
excerpt: "Breaking up a monolith into microservices sounds great until an order processes, a payment gateway fails, and your database goes out of sync. Enter the Saga Pattern."
---

## Why this matters

Microservices solve many scaling and deployment problems, but they introduce a new challenge: there is no single database transaction spanning multiple services.

Imagine an e-commerce application. The Order Service creates an order, the Payment Service charges the customer, and the Inventory Service reserves stock. If payment fails after the order has already been created, you're left with inconsistent data unless you have a recovery strategy.

Distributed transactions are one of the hardest problems in software architecture. Understanding how to handle failures gracefully is what separates resilient systems from fragile ones.

## The core idea

The **Saga Pattern** replaces one large transaction with a series of smaller local transactions.

Each service performs its own transaction and publishes an event. If everything succeeds, the workflow completes. If something fails, previously completed steps execute **compensating transactions** to undo their work.

A simple flow might look like this:

```
Create Order
      │
      ▼
Process Payment
      │
      ├── Success ──► Reserve Inventory ──► Confirm Order
      │
      └── Failure ──► Cancel Order
```

For example:

- Order Service creates Order #101.
- Payment Service attempts to charge the customer.
- The payment gateway declines the card.
- Instead of leaving an unpaid order in the database, the Order Service receives a failure event and automatically cancels the order.

No global database locks.
No two-phase commit.
Just coordinated local transactions with recovery built into the workflow.

There are two common ways to implement a Saga:

- **Choreography:** Services communicate through events without a central coordinator. Simple to start, but can become difficult to follow as the system grows.
- **Orchestration:** A dedicated orchestrator tells each service what to do next and handles failures. Easier to monitor and debug in larger systems.

## Practical takeaways

- Design every distributed operation assuming one of the services will eventually fail.
- Every important action should have a corresponding compensating action when possible.
- Prefer eventual consistency over trying to force a single transaction across multiple services.

That's issue #002. Short, practical, no filler.

— Syed
