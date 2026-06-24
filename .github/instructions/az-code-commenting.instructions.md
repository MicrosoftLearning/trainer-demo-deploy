---
description: "Guidelines for GitHub Copilot to write comments to achieve self-explanatory code with less comments. Examples are in C# but the principles apply to any language that has comments."
applyTo: "**"
---

# Self-explanatory Code Commenting Instructions

## Language-Specific Precedence

Language-specific instruction files take precedence over these general
guidelines. In particular:

- **C# / .NET** (`az-dotnet-webapp.instructions.md` if present): use XML doc
  comments (`/// <summary>`) on all public types and members.
- **PowerShell** (`az-powershell.instructions.md`): always include
  comment-based help (`.SYNOPSIS`, `.DESCRIPTION`, `.EXAMPLE`) on
  public functions.
- **Bicep** (`az-bicep-code-best-practices.instructions.md`): always use
  `@description` annotations on parameters, variables, and outputs.
- **Shell** (`shell.instructions.md`): include a header comment
  explaining the script's purpose.

These requirements are additive — public-facing APIs and parameters
must be documented per their language rules, while internal code
follows the minimal-comment philosophy below.

## Core Principle

**Write code that speaks for itself. Comment only when necessary to explain WHY, not WHAT.**
We do not need comments most of the time.

## Commenting Guidelines

### ❌ AVOID These Comment Types

**Obvious Comments**

```csharp
// Bad: States the obvious
int counter = 0;  // Initialize counter to zero
counter++;  // Increment counter by one
```

**Redundant Comments**

```csharp
// Bad: Comment repeats the code
public string GetUserName()
{
    return user.Name;  // Return the user's name
}
```

**Outdated Comments**

```csharp
// Bad: Comment doesn't match the code
// Calculate tax at 5% rate
var tax = price * 0.08m;  // Actually 8%
```

### ✅ WRITE These Comment Types

**Complex Business Logic**

```csharp
// Good: Explains WHY this specific calculation
// Apply progressive tax brackets: 10% up to 10k, 20% above
var tax = CalculateProgressiveTax(income, [0.10m, 0.20m], [10000m]);
```

**Non-obvious Algorithms**

```csharp
// Good: Explains the algorithm choice
// Using Floyd-Warshall for all-pairs shortest paths
// because we need distances between all nodes
for (int k = 0; k < vertices; k++)
{
    for (int i = 0; i < vertices; i++)
    {
        for (int j = 0; j < vertices; j++)
        {
            // ... implementation
        }
    }
}
```

**Regex Patterns**

```csharp
// Good: Explains what the regex matches
// Match email format: username@domain.extension
var emailPattern = new Regex(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
```

**API Constraints or Gotchas**

```csharp
// Good: Explains external constraint
// GitHub API rate limit: 5000 requests/hour for authenticated users
await rateLimiter.WaitAsync();
var response = await httpClient.GetAsync(githubApiUrl);
```

## Decision Framework

Before writing a comment, ask:

1. **Is the code self-explanatory?** → No comment needed
2. **Would a better variable/function name eliminate the need?** → Refactor instead
3. **Does this explain WHY, not WHAT?** → Good comment
4. **Will this help future maintainers?** → Good comment

## Special Cases for Comments

### Public APIs

```csharp
/// <summary>
/// Calculate compound interest using the standard formula.
/// </summary>
/// <param name="principal">Initial amount invested.</param>
/// <param name="rate">Annual interest rate (as decimal, e.g., 0.05 for 5%).</param>
/// <param name="time">Time period in years.</param>
/// <param name="compoundFrequency">How many times per year interest compounds.</param>
/// <returns>Final amount after compound interest.</returns>
public decimal CalculateCompoundInterest(decimal principal, decimal rate, int time, int compoundFrequency = 1)
{
    // ... implementation
}
```

### Configuration and Constants

```csharp
// Good: Explains the source or reasoning
private const int MaxRetries = 3;  // Based on network reliability studies
private const int ApiTimeoutMs = 5000;  // Azure Function timeout is 10min, leaving buffer
```

### Annotations

```csharp
// TODO: Replace with proper user authentication after security review
// FIXME: Memory leak in production - investigate connection pooling
// HACK: Workaround for bug in library v2.1.0 - remove after upgrade
// NOTE: This implementation assumes UTC timezone for all calculations
// WARNING: This method modifies the original collection instead of creating a copy
// PERF: Consider caching this result if called frequently in hot path
// SECURITY: Validate input to prevent SQL injection before using in query
// BUG: Edge case failure when collection is empty - needs investigation
// REFACTOR: Extract this logic into separate utility class for reusability
// DEPRECATED: Use NewApiMethod() instead - this will be removed in v3.0
```

## Anti-Patterns to Avoid

### Dead Code Comments

```csharp
// Bad: Don't comment out code
// private void OldMethod() { ... }
private void NewMethod() { ... }
```

### Changelog Comments

```csharp
// Bad: Don't maintain history in comments
// Modified by John on 2023-01-15
// Fixed bug reported by Sarah on 2023-02-03
public void ProcessData()
{
    // ... implementation
}
```

### Divider Comments

```csharp
// Bad: Don't use decorative comments
//=====================================
// UTILITY METHODS
//=====================================
```

## Quality Checklist

Before committing, ensure your comments:

- [ ] Explain WHY, not WHAT
- [ ] Are grammatically correct and clear
- [ ] Will remain accurate as code evolves
- [ ] Add genuine value to code understanding
- [ ] Are placed appropriately (above the code they describe)
- [ ] Use proper spelling and professional language

## Summary

Remember: **The best comment is the one you don't need to write because the code is self-documenting.**
