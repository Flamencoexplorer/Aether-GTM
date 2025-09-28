# Aether GTM: Mission Control

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Flamencoexplorer/Aether-GTM)

Aether GTM is a sophisticated, autonomous Go-To-Market (GTM) orchestration system designed to translate high-level business objectives into coordinated, agent-driven sales and marketing campaigns. The system is managed by a central Orchestration Agent that decomposes mission goals, manages a team of specialized subordinate agents (Sales, Engagement, Deal Desk, FinOps, Expansion), and enforces global constraints like budget and brand voice. A core feature is the 'Mission Control' UI, a minimalist and visually stunning web dashboard providing human-in-the-loop (HITL) oversight. This UI allows stakeholders to monitor the GTM funnel in real-time, track agent performance, adjust strategic parameters, and handle critical exceptions escalated by the AI, ensuring a perfect blend of autonomous execution and human strategic control.

## Key Features

*   **Funnel Visualization:** Real-time, end-to-end view of the prospect-to-customer journey.
*   **Agent Performance Monitoring:** Track metrics for each specialized agent (e.g., outreach response rate, pipeline velocity).
*   **Global Constraints Panel:** Dynamically adjust mission parameters like budget, brand voice, and risk tolerance.
*   **Exception Handling Queue:** A dedicated interface for human operators to approve or deny high-stakes decisions flagged by agents.
*   **Real-time Notifications:** An event feed for HITL actions with simple approve/deny interactions.
*   **Minimalist, Responsive UI:** A visually stunning and intuitive interface built for clarity and focus across all devices.

## Technology Stack

*   **Frontend:** React, Vite, React Router, Tailwind CSS
*   **UI Components:** shadcn/ui, Lucide React
*   **Animation:** Framer Motion
*   **Data Visualization:** Recharts
*   **State Management:** Zustand, TanStack Query
*   **Backend:** Cloudflare Workers, Hono
*   **Persistence:** Cloudflare Durable Objects
*   **Schema Validation:** Zod

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd aether-gtm
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.dev.vars` file in the root of the project for local development. You will need to get your Account ID and create an AI Gateway from your Cloudflare dashboard.

    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-openai-or-other-llm-api-key"
    ```

    **Note:** The `CF_AI_API_KEY` is your LLM provider's API key (e.g., OpenAI), which will be securely proxied through the Cloudflare AI Gateway.

## Development

To run the application in development mode with hot-reloading, use the following command. This will start both the Vite frontend server and the local Wrangler server for the backend worker.

```bash
bun dev
```

The application will be available at `http://localhost:3000`.

## Deployment

This project is designed for seamless deployment to the Cloudflare global network.

1.  **Build the application:**
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command will deploy your application, including the frontend assets and the backend worker with its Durable Object bindings.

    ```bash
    bun deploy
    ```

3.  **Configure Production Secrets:**
    After the first deployment, you must add your environment variables as secrets to your deployed worker.

    ```bash
    # Add your AI Gateway URL as a plain text variable
    npx wrangler vars put CF_AI_BASE_URL "https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"

    # Add your LLM API key as an encrypted secret
    npx wrangler secret put CF_AI_API_KEY
    ```
    You will be prompted to enter the value for `CF_AI_API_KEY` in your terminal.

4.  **Deploy with one click:**

    [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Flamencoexplorer/Aether-GTM)

## Project Structure

*   `src/`: Contains all the frontend React application code.
    *   `components/`: Reusable UI components.
    *   `pages/`: Top-level page components corresponding to application views.
    *   `lib/`: Utility functions and mock data.
    *   `main.tsx`: The main entry point for the React application.
*   `worker/`: Contains all the backend Cloudflare Worker and Durable Object code.
    *   `index.ts`: The entry point for the Cloudflare Worker.
    *   `agent.ts`: Defines the logic for specialized agents (as Durable Objects).
    *   `app-controller.ts`: The central state management Durable Object.
*   `wrangler.jsonc`: Configuration file for the Cloudflare Worker, including Durable Object bindings and environment variables.

## License

This project is licensed under the MIT License.