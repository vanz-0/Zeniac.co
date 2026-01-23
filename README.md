# Zeniac.Co - 3-Layer Architecture

This project uses a 3-layer architecture that separates concerns to maximize reliability by pushing complexity into deterministic code.

## Architecture Overview

### Layer 1: Directive (What to do)
- **Location**: `directives/`
- **Purpose**: SOPs written in Markdown
- **Contents**: Goals, inputs, tools/scripts to use, outputs, edge cases
- **Format**: Natural language instructions

### Layer 2: Orchestration (Decision making)
- **Agent**: AI orchestrator (Claude, Gemini, etc.)
- **Purpose**: Intelligent routing and decision making
- **Responsibilities**:
  - Read directives
  - Call execution tools in correct order
  - Handle errors
  - Ask for clarification
  - Update directives with learnings

### Layer 3: Execution (Doing the work)
- **Location**: `execution/`
- **Purpose**: Deterministic Python scripts
- **Contents**: API calls, data processing, file operations, database interactions
- **Principles**: Reliable, testable, fast, well-commented

## Directory Structure

```
Zeniac.Co/
├── directives/          # Markdown SOPs (instruction set)
├── execution/           # Python scripts (deterministic tools)
├── .tmp/               # Intermediate files (never commit)
├── .env                # Environment variables (never commit)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Operating Principles

1. **Check for tools first** - Before writing a script, check `execution/` per your directive
2. **Self-anneal when things break** - Fix, test, update directive
3. **Update directives as you learn** - Living documents that improve over time

## Self-Annealing Loop

When something breaks:
1. Fix it
2. Update the tool
3. Test tool
4. Update directive to include new flow
5. System is now stronger

## File Organization

- **Deliverables**: Cloud-based outputs (Google Sheets, Slides, etc.)
- **Intermediates**: Temporary files in `.tmp/` (can be deleted and regenerated)

## Getting Started

1. Copy `.env.example` to `.env` and fill in your API keys
2. Install Python dependencies: `pip install -r requirements.txt` (when created)
3. Read directives to understand available workflows
4. Run execution scripts as needed

## Key Principle

**LLMs are probabilistic, business logic is deterministic.**

This architecture fixes that mismatch by:
- Pushing complexity into deterministic code
- Letting AI focus on decision-making
- Maximizing reliability (90% accuracy per step = 59% success over 5 steps)
