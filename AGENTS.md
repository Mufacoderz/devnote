# Agent Workflow

When working in this repository:

- Create a branch before making changes unless the user explicitly asks to work on the current branch.
- Use branch names with the `codex/` prefix, for example `codex/fix-workspaces-route`.
- Keep changes scoped to the user request.
- Do not revert unrelated user changes.
- Prefer opening a pull request instead of pushing directly to `main`, unless the user explicitly asks to push to `main`.

## Commits

- Commit AI-authored work as:

  ```bash
  git -c user.name="devnote-agent" -c user.email="270543300+devnote-agent@users.noreply.github.com" commit -m "Clear commit message"
  ```

- Do not change global or repository Git config for the author identity unless the user explicitly asks.
- If the user wants their own account as the main author, keep their author identity and add this trailer to the commit message:

  ```text
  Co-authored-by: devnote-agent <270543300+devnote-agent@users.noreply.github.com>
  ```

- Keep commit messages short, specific, and focused on the user-visible fix or feature.
