# Contributing

Thank you for your interest in contributing to this project! We welcome patches, improvements, tests, and documentation.

Please follow these steps when contributing:

1. Fork the repository and create a topic branch:

   ```bash
   git checkout -b feat/your-feature
   ```

2. Make small, focused changes. Add tests for any new backend behavior.

3. Run the project's tests and linters before submitting:

   ```powershell
   cd backend
   npm install
   npm test
   ```

4. Commit with clear messages. Use conventional commits if possible (e.g., `fix:`, `feat:`, `docs:`).

5. Push your branch and open a Pull Request describing the change and why it's needed.

Code style and tests

- Keep code readable and consistent with the project's style.
- Add unit tests for business logic in the backend.

Security & secrets

- Never commit secrets or credentials. Use `.env` for local configuration and keep it out of version control.

Support

- If in doubt, open an issue first to discuss the planned change.
