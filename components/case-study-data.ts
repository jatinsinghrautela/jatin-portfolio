export const caseStudies = {
  opsradar: {
    subtitle: 'A small signal path. A clearer operational picture.',
    challenge: 'Legacy and resource-constrained hosts still need a way to report failures. A lightweight agent can send actionable alerts without installing a metrics database or a full observability stack on each machine.',
    nodes: [['HOSTS', 'Node CLI agents', 'Windows / Linux'], ['INGEST', 'Express API', 'Per-server API key'], ['PERSISTENCE', 'PostgreSQL', 'Alerts · inventory · retention'], ['CONSOLE', 'React web UI', 'JWT · scoped visibility']],
    flow: 'Agents send alerts, resolutions, and heartbeats to the API. The API persists records in PostgreSQL. The React console reads scoped data through the API; it does not connect to the database directly.',
    connections: [[0,1],[1,2],[3,1]],
    previews: ['Alert inbox', 'Host inventory', 'Notification feed'],
    takeaways: [['Design for the host', 'Keep the agent Node-only and move persistence and administration to the control plane. This keeps deployment practical on constrained hosts.'], ['Separate trust boundaries', 'Per-server ingest keys and web JWT sessions serve different callers. Keeping those paths distinct makes access easier to reason about.'], ['Liveness needs context', 'Heartbeat timing and retention are operational choices. A missing heartbeat is a host-liveness signal, not a complete diagnosis of the application.']],
    technologies: [['React + MUI', 'Web console and administration'], ['Node.js CLI', 'Agent heartbeats, alerts, and resolution'], ['Express + Sequelize', 'API boundary and persistence access'], ['PostgreSQL', 'Durable alert and inventory records'], ['Docker Compose', 'API, UI, and database services'], ['systemd / Windows services', 'Long-running host agent setup']],
    scope: 'Alerts and host liveness are the focus. Time-series metrics, log indexing, and distributed tracing are outside this implementation.'
  },
  roach: {
    subtitle: 'From a product on a shelf to a recorded sale.',
    challenge: 'A shop needs a consistent record of what is on hand, what moved, and what sold. Roach connects product identification with stock changes and invoices while keeping each shop’s records separate.',
    nodes: [['BROWSER', 'React + Redux', 'Inventory · scan · checkout'], ['GATEWAY', 'Nginx', 'One origin · /api · /uploads'], ['APPLICATION', 'Express API', 'Owner checks · session cookie'], ['PERSISTENCE', 'MongoDB', 'Products · movements · invoices']],
    flow: 'The browser reaches Nginx, which serves the React app and forwards API and image requests to Express. Express checks access and ownership before reading or changing MongoDB records. Images live in upload storage or optional Cloudinary.',
    connections: [[0,1],[1,2],[2,3]],
    previews: ['Inventory dashboard', 'Scan & restock', 'Checkout & invoices'],
    takeaways: [['Keep stock changes traceable', 'Restock, adjustment, and checkout movements create a history behind the current quantity rather than leaving only an unexplained number.'], ['Preserve the sale', 'Invoice lines retain the name, SKU, prices, and cost at checkout time, so later product edits do not redefine a past sale.'], ['Treat QR as identification', 'A product QR code identifies an item. Ownership and account-access checks still belong at the API boundary.']],
    technologies: [['React 18 + Redux Toolkit', 'Interface and client state'], ['React Router', 'Inventory and account navigation'], ['Express + Mongoose', 'Application routes and data models'], ['MongoDB', 'Shop-scoped records and invoices'], ['Nginx + Docker Compose', 'Single-origin deployment and services'], ['Camera / QR workflows', 'Product identification and stock actions']],
    scope: 'Payment extensions are recorded offline by an operator. There is no card-payment gateway. Email features require SMTP configuration.'
  }
} as const;
export type CaseStudyId = keyof typeof caseStudies;
