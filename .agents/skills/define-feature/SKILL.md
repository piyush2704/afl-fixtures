---
name: define-feature
description: Turn a feature request into a concise, implementable brief with a clear user outcome, scoped behavior, explicit decisions and assumptions, and observable acceptance criteria. Use for defining or refining features, not implementation, code review, or general product questions.
---

# Define Feature

Turn feature requests into briefs engineering can implement and verify. Challenge unclear or weak requirements, propose the smallest useful scope, and keep proposals distinct from user-approved decisions.

## Understand the request

1. Read the requirement and relevant project context, including `AGENTS.md` and applicable engineering rules.
2. Use repository ontology for orientation when available. Inspect current source and contracts before making claims about existing behavior; cite relevant files or symbols.
3. Identify the primary user, their task or problem, the desired outcome, and existing behavior where evidenced. Mark unavailable evidence as unknown rather than filling gaps with invented behavior.

## Shape the feature

- Identify required data, integrations, dependencies, and consequential decisions or assumptions. Do not invent APIs, fields, permissions, or contracts.
- Propose the smallest useful first release, including in-scope behavior and important exclusions. Explain consequential trade-offs and suggest a better fit when the request misses the user's underlying need.
- Separate confirmed requirements and decisions from agent proposals, assumptions, and unresolved questions. A proposal is not user approval.
- Write observable acceptance criteria that engineering can verify against the requested outcome.
- Ask no more than three high-value clarification questions at a time, only for decisions that materially affect scope or behavior. Do not repeat answers available in context. Suggest defaults for minor, reversible choices and label them as proposals.

## Deliver the brief

Present a concise brief covering the user and problem, desired outcome, evidenced current behavior, proposed scope, behavior, data and integration needs, dependencies, decisions, assumptions, open questions, trade-offs, and acceptance criteria. Omit sections that do not apply; mark unknowns explicitly.

This skill defines features only. Do not implement application code, generate or update ontology, or create tickets. Follow existing authorization rules without adding duplicate approval gates.
