export function generateReadmeContent(description: string, convexDeploymentName: string | null): string {
  return `# ${description}

## 🚀 Tech Stack

- **Frontend**: [Expo](https://expo.dev) & [React Native](https://reactnative.dev)
- **UI Components**: [BNA UI](https://ui.ahmedbna.com)
- **Backend**: [Convex](https://convex.dev)
- **Authentication**: [Convex Auth](https://auth.convex.dev/)
- **Built with**: [BNA](https://ai.ahmedbna.com)

${convexDeploymentName ? `## 🔗 Deployment\n\nThis project is connected to the Convex deployment: [\`${convexDeploymentName}\`](https://dashboard.convex.dev/d/${convexDeploymentName})\n` : ''}
## 📁 Project Structure

\`\`\`
├── app/              # Frontend code (Expo/React Native)
├── convex/           # Backend code (Convex functions)
│   ├── router.ts     # User-defined HTTP routes
│   └── http.ts       # Core HTTP configuration
└── README.md
\`\`\`

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development servers:

**Frontend** (Expo):
\`\`\`bash
npx expo start
\`\`\`

**Backend** (Convex):
\`\`\`bash
npx convex dev
\`\`\`

## 🔐 Authentication

This app uses [Convex Auth](https://auth.convex.dev/) with **Anonymous authentication** enabled by default for frictionless user onboarding. 

⚠️ **Important**: Consider implementing additional authentication methods (email/password, OAuth, etc.) before deploying to production.

## 🌐 HTTP API

Custom HTTP routes are defined in \`convex/router.ts\`. This separation from \`convex/http.ts\` ensures authentication routes remain protected from unintended modifications.

### Adding Custom Routes

Edit \`convex/router.ts\` to add your custom API endpoints while keeping core authentication logic isolated.

## 📚 Resources

- [BNA UI Documentation](https://ui.ahmedbna.com) - UI components guides and best practices
- [Expo Documentation](https://docs.expo.dev) - Mobile app development
- [Convex Documentation](https://docs.convex.dev) - Backend development guides
- [Convex Auth Docs](https://labs.convex.dev/auth) - Authentication setup

## 🚢 Deploying to Production

Before deploying, make sure to:

1. Review and enhance authentication methods
2. Set up environment variables
3. Configure production Convex deployment
4. Test thoroughly on both iOS and Android
`;
}
