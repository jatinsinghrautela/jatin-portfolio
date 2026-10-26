export type PortfolioProject = {
  id: string;
  title: string;
  category: 'DevOps' | 'Development';
  tags: string[];
  description: string;
  story: string;
  image?: string;
  imageAlt?: string;
  features: string[];
  architecture: string[];
  repository?: string;
  plannedRepository?: string;
};

export const projects: PortfolioProject[] = [
  {
    id: 'opsradar',
    title: 'OpsRadar',
    category: 'DevOps',
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker Compose'],
    description: 'A lightweight alert bridge for Windows and Linux hosts where a full observability stack is too much.',
    story: 'OpsRadar brings host alerts and heartbeats into one self-hosted web console. Thin Node.js CLI agents report to an Express API, while a React admin interface provides inventory management, scoped alerts, and in-app notifications. The project is being presented under its new name, OpsRadar; the reference implementation was named LongShot / AlertOn.',
    image: '/images/opsradar-alert-bridge.webp',
    imageAlt: 'Conceptual illustration of host agents sending orange heartbeat signals to a central alert console and database',
    features: [
      'Alert ingest, resolution, and heartbeats from Node-only agents on Windows or Linux.',
      'Per-server API keys for agents, JWT sign-in for the web console, and optional authenticator-based TOTP.',
      'Inventory organized by country, application, group, and server, with scoped user visibility.',
      'Configurable alert retention and heartbeat-based detection of unavailable hosts.',
      'Docker Compose control plane with PostgreSQL persistence; systemd and Windows service setup for agents.'
    ],
    architecture: ['Node CLI agents', 'Express API', 'PostgreSQL', 'React console'],
    plannedRepository: 'https://github.com/jatinsinghrautela/OpsRadar'
  },
  {
    id: 'roach',
    title: 'Roach',
    category: 'Development',
    tags: ['React', 'Redux Toolkit', 'Express', 'MongoDB', 'Docker Compose'],
    description: 'A shop inventory application that connects product records, QR scanning, stock movements, and checkout.',
    story: 'Roach gives each shop a private workspace for its products, stock movements, invoices, and alerts. A React front end is served through Nginx, which forwards API and image requests to Express. MongoDB stores the inventory and sales records, while Docker Compose brings the services together.',
    image: '/images/roach-inventory.webp',
    imageAlt: 'Conceptual illustration of product shelves, a scanner, an inventory panel, and a checkout receipt',
    features: [
      'Product records with photos or camera stills, prices, costs, quantities, and reorder levels.',
      'Downloadable product QR labels, camera scanning, and name or SKU search as a fallback.',
      'Restocking, multi-item checkout, stock movement history, and invoices with sale-time line snapshots.',
      'Sales reports for units, revenue, cost, and profit, plus low-stock and out-of-stock notifications.',
      'Shop-scoped accounts, a 30-day trial, and operator-recorded offline payments that extend access without deleting data.'
    ],
    architecture: ['React + Redux', 'Nginx', 'Express API', 'MongoDB'],
    repository: 'https://github.com/diwakar767/Roach'
  },
  {
    id: 'pipeline',
    title: 'Delivery at production pace.',
    category: 'DevOps',
    tags: ['Azure DevOps', 'ArgoCD', 'Kubernetes'],
    description: 'CI/CD and GitOps delivery for production workloads at Comviva.',
    story: 'Designed and implemented pipelines using Azure DevOps and ArgoCD, accelerating deployment frequency by 40%. Work also included Kubernetes and Azure infrastructure optimization and AWS application operations.',
    features: [],
    architecture: ['Commit', 'Build', 'Deploy', 'Observe']
  }
];
