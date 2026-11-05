---
name: review-change
description: Review a defined code or test change for correctness, security, reliability, unnecessary complexity, and missing verification. Use for a specific diff, commit, or implemented feature increment, not implementation, architecture advice, or requirements definition.
---

# Review Change

Review the selected change boundary and report only evidence-backed findings. Do not modify code or the feature brief.

## Workflow

1. Establish the boundary: selected files, uncommitted changes, commit, or comparison reference. If unclear, ask before reviewing. Exclude unrelated changes.
2. Read the agreed feature brief and applicable project instructions. Use ontology for navigation when available, then verify against current source, call sites, contracts, and relevant tests.
3. Check behavior against acceptance criteria. Treat implementation summaries as claims to verify, not proof.
4. Trace relevant failure paths and boundary conditions. Assess correctness, security, reliability, and whether the change adds unnecessary complexity.
5. Assess whether tests cover the intended behavior and plausible defects. Run relevant checks when appropriate and report exact commands, outcomes, and skipped checks with reasons. Never claim unrun verification.

## Findings and limits

Lead with actionable findings, each tied to changed code and its impact. Do not manufacture defects or present preferences as correctness issues. If no findings are supported, say so and summarize the review scope and verification evidence. Do not claim broad production readiness from a narrow review.

Do not fix the change, modify the feature brief, or make unrelated edits. Follow existing authorization rules without adding duplicate approval gates.
